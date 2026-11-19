import { Op, Transaction, WhereOptions, literal } from "sequelize";
import { AccessContext } from "../../domain/interfaces/access-context.interface";
import { sequelize } from "../config/sequelize.adapter";
import {
  Ambulance, ChecklistAmbulance, ChecklistSupply, Delegation, Guard, Pharmacy,
  Question, QuestionCategory, QuestionSubcategory, Shift, Supply,
  SupplyAmbulance, SupplyReport, SupplyReportItem, User,
} from "../models/store/models.store";

const models = {
  User, Delegation, Ambulance, Guard, Pharmacy, Shift, Supply, SupplyAmbulance,
  ChecklistAmbulance, ChecklistSupply, Question, QuestionCategory,
  QuestionSubcategory, SupplyReport, SupplyReportItem,
};
export type ScopedResource = keyof typeof models | "Log";

/** Applies the authenticated user's territory before pagination and counting. */
export class DelegationScope {
  constructor(readonly actor: AccessContext) {}

  where(resource: ScopedResource, conditions: WhereOptions = {}): WhereOptions {
    if (this.actor.role === "general_admin") return conditions;
    const delegationId = this.actor.delegationId;
    if (!delegationId) throw "DELEGATION_ACCESS_DENIED";
    const escaped = sequelize.escape(delegationId);
    const indirect: Partial<Record<ScopedResource, string>> = {
      Shift: `SELECT s.id FROM shifts s JOIN guards g ON g.id=s.guard_id WHERE g.delegation_id=${escaped}`,
      Supply: `SELECT s.id FROM supplies s JOIN pharmacies p ON p.id=s.pharmacy_id WHERE p.delegation_id=${escaped}`,
      SupplyAmbulance: `SELECT s.id FROM supplies_ambulances s JOIN ambulances a ON a.id=s.ambulance_id WHERE a.delegation_id=${escaped}`,
      ChecklistAmbulance: `SELECT c.id FROM checklist_ambulances c JOIN shifts s ON s.id=c.shift_id JOIN guards g ON g.id=s.guard_id WHERE g.delegation_id=${escaped}`,
      ChecklistSupply: `SELECT c.id FROM checklist_supplies c JOIN shifts s ON s.id=c.shift_id JOIN guards g ON g.id=s.guard_id WHERE g.delegation_id=${escaped}`,
      SupplyReport: `SELECT r.id FROM supply_reports r JOIN ambulances a ON a.id=r.ambulance_id WHERE a.delegation_id=${escaped}`,
      SupplyReportItem: `SELECT i.id FROM supply_report_items i JOIN supply_reports r ON r.id=i.report_id JOIN ambulances a ON a.id=r.ambulance_id WHERE a.delegation_id=${escaped}`,
    };
    const query = indirect[resource];
    const territory = query
      ? { id: { [Op.in]: literal(`(${query})`) } }
      : { [resource === "Delegation" ? "id" : "delegation_id"]: delegationId };
    return { [Op.and]: [conditions, territory] };
  }

  assertDelegation(delegationId: string) {
    if (this.actor.role !== "general_admin" && delegationId !== this.actor.delegationId) {
      throw "DELEGATION_ACCESS_DENIED";
    }
  }

  static same(...delegationIds: string[]) {
    if (!delegationIds.length || delegationIds.some((id) => !id || id !== delegationIds[0])) {
      throw "DELEGATION_MISMATCH";
    }
  }

  async assertUserManagement(id: string, transaction?: Transaction, newRole?: string) {
    const user = await User.findOne({
      where: this.where("User", { id }), transaction,
      ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}),
    });
    if (!user) throw "DELEGATION_ACCESS_DENIED";
    if (this.actor.role !== "general_admin" && (
      user.role === "general_admin" ||
      (newRole !== undefined && newRole !== user.role && ["admin", "general_admin"].includes(newRole))
    )) throw "ADMIN_ROLE_RESTRICTED";
  }

  async assertShiftLinks(ambulanceId: string, guardId: string, paramedicalId: string, driverId: string, tx: Transaction) {
    DelegationScope.same(
      await this.delegationOf("Ambulance", ambulanceId, tx),
      await this.delegationOf("Guard", guardId, tx),
      await this.delegationOf("User", paramedicalId, tx),
      await this.delegationOf("User", driverId, tx),
    );
  }

  async assertShiftChecklist(id: string, ambulanceId: string, tx: Transaction) {
    const checklist = await ChecklistAmbulance.findOne({ where: { shift_id: id }, transaction: tx });
    if (checklist && checklist.ambulance_id !== ambulanceId) throw "DELEGATION_MISMATCH";
  }

  async assertUserMove(id: string, delegationId: string, tx: Transaction) {
    const user = await User.findOne({ where: this.where("User", { id }), transaction: tx, lock: tx.LOCK.UPDATE });
    if (!user) throw "DELEGATION_ACCESS_DENIED";
    if (user.delegation_id === delegationId) return;
    const guards = await Guard.findAll({ where: { guard_chief: id }, transaction: tx, lock: tx.LOCK.UPDATE });
    for (const guard of guards) DelegationScope.same(delegationId, guard.delegation_id);
    const shifts = await Shift.findAll({ where: { [Op.or]: [{ driver_id: id }, { paramedical_id: id }] }, transaction: tx, lock: tx.LOCK.UPDATE });
    for (const shift of shifts) DelegationScope.same(delegationId, await this.delegationOf("Guard", shift.guard_id, tx));
    for (const [resource, model] of [["ChecklistAmbulance", ChecklistAmbulance], ["ChecklistSupply", ChecklistSupply]] as const) {
      const signed = await (model as typeof ChecklistSupply).findAll({
        where: { [Op.or]: [{ deliverer_id: id }, { recipient_id: id }] }, transaction: tx, lock: tx.LOCK.UPDATE,
      });
      for (const checklist of signed) DelegationScope.same(delegationId, await this.delegationOf(resource, checklist.id, tx));
    }
  }

  async assertAmbulanceMove(id: string, delegationId: string, tx: Transaction) {
    await this.delegationOf("Ambulance", id, tx);
    const shifts = await Shift.findAll({ where: { ambulance_id: id }, transaction: tx, lock: tx.LOCK.UPDATE });
    for (const shift of shifts) DelegationScope.same(delegationId, await this.delegationOf("Guard", shift.guard_id, tx));
  }

  async assertGuardMove(id: string, delegationId: string, tx: Transaction) {
    await this.delegationOf("Guard", id, tx);
    const shifts = await Shift.findAll({ where: { guard_id: id }, transaction: tx, lock: tx.LOCK.UPDATE });
    for (const shift of shifts) {
      DelegationScope.same(delegationId,
        await this.delegationOf("Ambulance", shift.ambulance_id, tx),
        await this.delegationOf("User", shift.paramedical_id, tx),
        await this.delegationOf("User", shift.driver_id, tx));
    }
  }

  async delegationOf(resource: Exclude<ScopedResource, "Log">, id: string, transaction?: Transaction): Promise<string> {
    const model = models[resource] as typeof User;
    const row = await model.findOne({ where: this.where(resource, { id }), transaction, ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}) });
    if (!row) throw "DELEGATION_ACCESS_DENIED";
    if (resource === "Delegation") return row.id;
    const value = row.get({ plain: true }) as unknown as Record<string, string>;
    if (value.delegation_id) return value.delegation_id;
    const parent: Partial<Record<ScopedResource, [Exclude<ScopedResource, "Log">, string]>> = {
      Shift: ["Guard", "guard_id"], Supply: ["Pharmacy", "pharmacy_id"],
      SupplyAmbulance: ["Ambulance", "ambulance_id"],
      ChecklistAmbulance: ["Shift", "shift_id"], ChecklistSupply: ["Shift", "shift_id"],
      SupplyReport: ["Ambulance", "ambulance_id"], SupplyReportItem: ["SupplyReport", "report_id"],
    };
    const link = parent[resource];
    if (!link) throw "DELEGATION_ACCESS_DENIED";
    return this.delegationOf(link[0], value[link[1]], transaction);
  }
}
