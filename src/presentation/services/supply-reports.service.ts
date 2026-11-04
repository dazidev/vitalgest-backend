import { Transaction } from "sequelize";
import {
  LogEntityDto,
  PaginationDto,
  SupplyReportEntityDto,
} from "../../application";
import { ERROR_CODES, LogActions, LogEntities } from "../../domain";
import {
  Ambulance,
  ChecklistSupply,
  sequelize,
  SupplyReport,
  SupplyReportItem,
} from "../../infrastructure";
import { LogsService } from "./logs.service";

export class SupplyReportsService {
  private readonly logsService = new LogsService();

  async getReports(paginationDto: PaginationDto): Promise<object> {
    const { limit, offset } = paginationDto;

    try {
      const { count, rows: reports } = await SupplyReport.findAndCountAll({
        include: [
          {
            model: Ambulance,
            as: "ambulance",
            attributes: ["id", "number"],
          },
          {
            model: ChecklistSupply,
            as: "checklist",
            attributes: ["notes"],
            required: false,
          },
          {
            model: SupplyReportItem,
            as: "items",
            required: false,
          },
        ],
        distinct: true,
        order: [
          ["createdAt", "DESC"],
          ["id", "ASC"],
        ],
        ...(limit !== undefined ? { limit } : {}),
        ...(offset !== undefined ? { offset } : {}),
      });

      const formattedReports = reports.map((report) => {
        const items =
          (report.get("items") as SupplyReportItem[] | undefined) ?? [];

        const formatItem = (item: SupplyReportItem) => {
          const currentQuantity = item.reported_quantity + item.added_quantity;

          const remainingQuantity = Math.max(
            0,
            item.min_quantity - currentQuantity,
          );

          return {
            id: item.id,
            category: item.category,
            specification: item.specification,
            measurement_unit: item.measurement_unit,

            min_quantity: item.min_quantity,
            reported_quantity: item.reported_quantity,
            required_quantity: item.required_quantity,
            added_quantity: item.added_quantity,

            current_quantity: currentQuantity,
            remaining_quantity: remainingQuantity,
            is_resolved: item.is_resolved,
          };
        };

        type FormattedItem = ReturnType<typeof formatItem>;

        const groupedAreas = new Map<
          number,
          {
            area_id: number;
            area_name: string;
            section: string;
            order: number;
            supplies: FormattedItem[];
          }
        >();

        const orderedItems = [...items].sort(
          (a, b) =>
            a.area_order - b.area_order || a.category.localeCompare(b.category),
        );

        for (const item of orderedItems) {
          let area = groupedAreas.get(item.area_id);

          if (!area) {
            area = {
              area_id: item.area_id,
              area_name: item.area_name,
              section: item.section,
              order: item.area_order,
              supplies: [],
            };

            groupedAreas.set(item.area_id, area);
          }

          area.supplies.push(formatItem(item));
        }

        return {
          id: report.id,
          checklist_id: report.checklist_id,
          notes: report.checklist?.notes ?? null,
          ambulance: report.ambulance
            ? {
                id: report.ambulance.id,
                number: report.ambulance.number,
              }
            : null,
          status: report.status,
          attended_at: report.attended_at,
          createdAt: report.get("createdAt") as Date,
          updatedAt: report.get("updatedAt") as Date,
          areas: Array.from(groupedAreas.values()),
        };
      });

      return {
        success: true,
        data: formattedReports,
        total: count,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }

  async updateSupplies(
    supplyReportEntityDto: SupplyReportEntityDto,
    userId: string,
  ): Promise<object> {
    const { reportId, items } = supplyReportEntityDto;

    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const report = await SupplyReport.findOne({
        where: { id: reportId },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!report) throw ERROR_CODES.SUPPLY_REPORT_NOT_FOUND;

      const updatedItems = [];

      const changes: string[] = [];
      let changedCount = 0;

      for (const answer of items) {
        const item = await SupplyReportItem.findOne({
          where: {
            id: answer.itemId,
            report_id: reportId,
          },
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        if (!item) throw ERROR_CODES.SUPPLY_REPORT_ITEM_NOT_FOUND;

        const addedQuantity = answer.addedQuantity;

        const previousAddedQuantity = item.added_quantity;
        const previousRemainingQuantity = Math.max(
          0,
          item.min_quantity - (item.reported_quantity + previousAddedQuantity),
        );

        const currentQuantity = item.reported_quantity + addedQuantity;

        if (!Number.isSafeInteger(currentQuantity)) {
          throw ERROR_CODES.INVALID_ADDED_QUANTITY;
        }

        const remainingQuantity = Math.max(
          0,
          item.min_quantity - currentQuantity,
        );

        const isResolved = remainingQuantity === 0;

        const hasChanges =
          previousAddedQuantity !== addedQuantity ||
          item.is_resolved !== isResolved;

        if (hasChanges) {
          await item.update(
            {
              added_quantity: addedQuantity,
              is_resolved: isResolved,
            },
            { transaction: tx },
          );

          changedCount++;

          // Mantener la descripción del log dentro de 2000 caracteres.
          if (changes.length < 6) {
            changes.push(
              `${item.category.slice(0, 40)} (${item.id}): ` +
                `agregado ${previousAddedQuantity} -> ${addedQuantity}, ` +
                `faltante ${previousRemainingQuantity} -> ${remainingQuantity}`,
            );
          }
        }

        updatedItems.push({
          id: item.id,
          category: item.category,
          min_quantity: item.min_quantity,
          reported_quantity: item.reported_quantity,
          required_quantity: item.required_quantity,
          added_quantity: addedQuantity,
          current_quantity: currentQuantity,
          remaining_quantity: remainingQuantity,
          is_resolved: isResolved,
        });
      }

      if (changedCount > 0) {
        const omitted = Math.max(0, changedCount - changes.length);

        const [logError, logDto] = LogEntityDto.create({
          userId,
          affected: report.id,
          entity: LogEntities.supplyReport,
          action: LogActions.supplyReport.updateItems,
          description:
            `Se actualizaron ${changedCount} registros de suministro ` +
            `del reporte de reabastecimiento ${report.id}. ` +
            `Ambulancia: ${report.ambulance_id}. ` +
            `Cambios: ${changes.join("; ")}.` +
            (omitted > 0
              ? ` Se omitieron ${omitted} cambios del detalle del log.`
              : ""),
        });

        if (logError) throw logError;

        await this.logsService.create(logDto!, tx);
      }

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: updatedItems,
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async attendReport(id: string, userId: string): Promise<object> {
    let tx: Transaction | undefined;

    try {
      tx = await sequelize.transaction();

      const report = await SupplyReport.findOne({
        where: { id },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      if (!report) throw ERROR_CODES.SUPPLY_REPORT_NOT_FOUND;

      if (report.status === "pending") {
        const previousStatus = report.status;
        const attendedAt = new Date();

        await report.update(
          {
            status: "attended",
            attended_at: attendedAt,
          },
          { transaction: tx },
        );

        const [logError, logDto] = LogEntityDto.create({
          userId,
          affected: report.id,
          entity: LogEntities.supplyReport,
          action: LogActions.supplyReport.attend,
          description:
            `Se marcó como atendido el reporte de reabastecimiento ` +
            `${report.id}. ` +
            `Ambulancia: ${report.ambulance_id}. ` +
            `Checklist: ${report.checklist_id}. ` +
            `Estado: ${previousStatus} -> attended. ` +
            `Fecha de atención: ${attendedAt.toISOString()}.`,
        });

        if (logError) throw logError;

        await this.logsService.create(logDto!, tx);
      }

      await tx.commit();
      tx = undefined;

      return {
        success: true,
        data: {
          id: report.id,
          status: report.status,
          attended_at: report.attended_at,
        },
      };
    } catch (error) {
      if (tx) await tx.rollback();

      if (typeof error === "string") throw error;

      throw ERROR_CODES.UPDATE_FAILED;
    }
  }

  async getReport(id: string): Promise<object> {
    try {
      const report = await SupplyReport.findByPk(id, {
        include: [
          {
            model: Ambulance,
            as: "ambulance",
            attributes: ["id", "number"],
          },
          {
            model: ChecklistSupply,
            as: "checklist",
            attributes: ["notes"],
            required: false,
          },
          {
            model: SupplyReportItem,
            as: "items",
            required: false,
          },
        ],
      });

      if (!report) throw ERROR_CODES.SUPPLY_REPORT_NOT_FOUND;

      const items =
        (report.get("items") as SupplyReportItem[] | undefined) ?? [];

      const formatItem = (item: SupplyReportItem) => {
        const currentQuantity = item.reported_quantity + item.added_quantity;

        const remainingQuantity = Math.max(
          0,
          item.min_quantity - currentQuantity,
        );

        return {
          id: item.id,
          category: item.category,
          specification: item.specification,
          measurement_unit: item.measurement_unit,

          min_quantity: item.min_quantity,
          reported_quantity: item.reported_quantity,
          required_quantity: item.required_quantity,
          added_quantity: item.added_quantity,

          current_quantity: currentQuantity,
          remaining_quantity: remainingQuantity,
          is_resolved: item.is_resolved,
        };
      };

      type FormattedItem = ReturnType<typeof formatItem>;

      const groupedAreas = new Map<
        number,
        {
          area_id: number;
          area_name: string;
          section: string;
          order: number;
          supplies: FormattedItem[];
        }
      >();

      const orderedItems = [...items].sort(
        (a, b) =>
          a.area_order - b.area_order || a.category.localeCompare(b.category),
      );

      for (const item of orderedItems) {
        let area = groupedAreas.get(item.area_id);

        if (!area) {
          area = {
            area_id: item.area_id,
            area_name: item.area_name,
            section: item.section,
            order: item.area_order,
            supplies: [],
          };

          groupedAreas.set(item.area_id, area);
        }

        area.supplies.push(formatItem(item));
      }

      const formattedReport = {
        id: report.id,
        checklist_id: report.checklist_id,
        notes: report.checklist?.notes ?? null,
        ambulance: report.ambulance
          ? {
              id: report.ambulance.id,
              number: report.ambulance.number,
            }
          : null,
        status: report.status,
        attended_at: report.attended_at,
        createdAt: report.get("createdAt") as Date,
        updatedAt: report.get("updatedAt") as Date,
        areas: Array.from(groupedAreas.values()),
      };

      return {
        success: true,
        data: formattedReport,
      };
    } catch (error) {
      if (typeof error === "string") throw error;
      throw ERROR_CODES.UNKNOWN_DB_ERROR;
    }
  }
}
