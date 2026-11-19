// Opt-in integration test against the already seeded development database.
// Only tagged fixtures are created/deleted; this test never resets a database.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { Op } = require("sequelize");
const db = require("../src/infrastructure");
const dto = require("../src/application");
const { DelegationScope } = require("../src/infrastructure/helpers/delegation-scope");
const { AdmService } = require("../src/presentation/services/adm.service");
const { AmbulancesService } = require("../src/presentation/services/ambulance.service");
const { GuardsService } = require("../src/presentation/services/guards.service");
const { ShiftsService } = require("../src/presentation/services/shifts.service");
const { QuestionsService } = require("../src/presentation/services/questions.service");
const { ChecklistsService } = require("../src/presentation/services/checklists.service");
const { SuppliesService } = require("../src/presentation/services/supplies.service");
const { SupplyReportsService } = require("../src/presentation/services/supply-reports.service");
const { DelegationsService } = require("../src/presentation/services/delegations.service");
const { LogsService } = require("../src/presentation/services/logs.service");

function validated(Type, method, value) {
  const [error, result] = Type[method](value);
  assert.equal(error, undefined);
  return result;
}
const pagination = () => validated(dto.PaginationDto, "validate", { limit: "100", offset: "0" });
const denied = async (action, ...codes) => assert.rejects(action, (error) => codes.includes(typeof error === "string" ? error : error.message));

test("territorial isolation, relationships, logs and seed integrity on TiDB", { timeout: 240000 }, async (t) => {
  const tag = `access-test-${randomUUID()}`;
  const created = new Map();
  const baseline = new Map();
  const remember = (model, row) => { created.set(model, [...(created.get(model) ?? []), row.id]); return row; };
  const create = async (model, values) => remember(model, await db[model].create(values));
  const result = async (model, promise) => { const response = await promise; remember(model, response.data); return response.data; };
  try {
    await db.sequelize.authenticate();
    for (const model of ["User", "Delegation", "Pharmacy", "Ambulance", "Guard", "Shift", "Supply", "SupplyAmbulance", "QuestionCategory", "QuestionSubcategory", "Question", "ChecklistAmbulance", "ChecklistSupply", "SupplyReport", "Log"]) {
      baseline.set(model, await db[model].count());
    }
    const users = await db.User.findAll();
    for (const role of ["general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"]) {
      assert.ok(users.some((user) => user.role === role), `Seed role ${role}`);
    }
    const byRole = (role) => users.find((user) => user.role === role);
    const actor = (user) => ({ id: user.id, role: user.role, delegationId: user.delegation_id });
    const general = actor(byRole("general_admin"));
    const local = actor(byRole("admin"));
    assert.equal(new Set(users.map((u) => u.delegation_id)).size, 1);
    const seedCategories = await db.QuestionCategory.findAll();
    assert.equal(seedCategories.length, 9);
    assert.ok(seedCategories.every((c) => c.delegation_id === local.delegationId));
    const seedQuestions = await db.Question.findAll();
    assert.ok(seedQuestions.length > 0 && seedQuestions.every((q) => q.delegation_id === local.delegationId));
    assert.ok((await db.QuestionSubcategory.findAll()).every((s) => s.delegation_id === local.delegationId));
    assert.equal(await db.AreaAmbulance.count(), 7);

    const municipality = await db.Municipality.findOne({ where: { name: "Tala" } });
    const otherDelegation = await create("Delegation", { name: tag, municipality_id: municipality.id });
    const pharmacy = await create("Pharmacy", { delegation_id: otherDelegation.id });
    const localPharmacy = await db.Pharmacy.findOne({ where: { delegation_id: local.delegationId } });
    const foreignUsers = {};
    for (const role of ["admin", "head_guard", "paramedical", "vehicle_operator"]) {
      foreignUsers[role] = await create("User", {
        name: tag, lastname: role, email: `${role}-${tag}@example.test`, password: byRole(role).password,
        status: true, role, position: role, delegation_id: otherDelegation.id,
      });
    }
    const foreign = actor(foreignUsers.admin);
    const ambulance = await create("Ambulance", { number: `${tag}-A`, brand: "Test", model: "Test", delegation_id: local.delegationId });
    const foreignAmbulance = await create("Ambulance", { number: `${tag}-B`, brand: "Test", model: "Test", delegation_id: foreign.delegationId });
    const guard = await create("Guard", { date: new Date("2030-02-03"), state: "Nueva", guard_chief: byRole("head_guard").id, delegation_id: local.delegationId });
    const foreignGuard = await create("Guard", { date: new Date("2030-02-03"), state: "Nueva", guard_chief: foreignUsers.head_guard.id, delegation_id: foreign.delegationId });
    const shift = await create("Shift", { name: tag, ambulance_id: ambulance.id, guard_id: guard.id, paramedical_id: byRole("paramedical").id, driver_id: byRole("vehicle_operator").id });
    const foreignShift = await create("Shift", { name: tag, ambulance_id: foreignAmbulance.id, guard_id: foreignGuard.id, paramedical_id: foreignUsers.paramedical.id, driver_id: foreignUsers.vehicle_operator.id });
    const adm = new AdmService(), ambulances = new AmbulancesService(), shifts = new ShiftsService();
    const questions = new QuestionsService(), checklists = new ChecklistsService(), supplies = new SuppliesService();
    const reports = new SupplyReportsService(), logs = new LogsService();
    const categoryDto = validated(dto.QuestionCategoryEntityDto, "create", { name: tag });
    const category = await result("QuestionCategory", questions.createCategory(local, categoryDto, local.id));
    const foreignCategory = await result("QuestionCategory", questions.createCategory(foreign, categoryDto, foreign.id));
    const questionData = (categoryId) => validated(dto.QuestionEntityDto, "create", { question: tag, categoryId, typeResponse: "bool" });
    const question = await result("Question", questions.createQuestion(local, questionData(category.id), local.id));
    const foreignQuestion = await result("Question", questions.createQuestion(foreign, questionData(foreignCategory.id), foreign.id));

    await t.test("list filters and totals remain inside the authenticated delegation", async () => {
      const filtered = await adm.getAllUsers(local, validated(dto.PaginationDto, "validate", { role: "admin" }));
      assert.ok(filtered.data.every((u) => u.delegation.id === local.delegationId));
      assert.equal(filtered.total, 1);
      const list = await ambulances.getAmbulances(local, pagination());
      assert.ok(list.data.some((a) => a.id === ambulance.id));
      assert.ok(!list.data.some((a) => a.id === foreignAmbulance.id));
      assert.equal(list.total, await db.Ambulance.count({ where: { delegation_id: local.delegationId } }));
      const visibleDelegations = await new DelegationsService().getDelegations(local, pagination());
      assert.equal(visibleDelegations.total, 1);
      const visibleGuards = await new GuardsService().getGuards(local, pagination());
      assert.ok(!visibleGuards.data.some((g) => g.id === foreignGuard.id));
      assert.equal((await shifts.getShifts(local, foreignGuard.id, pagination())).total, 0);
      const all = await ambulances.getAmbulances(general, pagination());
      assert.ok(all.data.some((a) => a.id === foreignAmbulance.id));
      await denied(() => adm.getUserById(local, foreign.id), "USER_NOT_FOUND");
      await denied(() => ambulances.getOneAmbulance(local, foreignAmbulance.id), "AMBULANCE_NOT_FOUND");
      await denied(() => shifts.getOneShift(local, foreignShift.id), "SHIFT_NOT_FOUND");
    });

    await t.test("categories and questions inherit territory without adding response fields", async () => {
      assert.ok(!("delegation_id" in JSON.parse(JSON.stringify(category))));
      assert.ok(!("delegation_id" in question));
      const own = await questions.getQuestions(local, pagination());
      assert.ok(own.data.some((q) => q.id === question.id));
      assert.ok(!own.data.some((q) => q.id === foreignQuestion.id));
      const checklistQuestions = await checklists.getAmbQuestions(local);
      assert.ok(!checklistQuestions.data.some((q) => q.id === foreignQuestion.id));
      await denied(() => questions.getCategory(local, foreignCategory.id), "QUESTION_CATEGORY_NOT_FOUND");
      await denied(() => questions.createQuestion(local, questionData(foreignCategory.id), local.id), "QUESTION_CATEGORY_NOT_FOUND");
      const edit = validated(dto.QuestionCategoryEntityDto, "edit", { id: foreignCategory.id, name: `${tag}-edited` });
      await questions.editCategory(general, edit, general.id);
      const persisted = await db.QuestionCategory.findByPk(foreignCategory.id);
      assert.equal(persisted.delegation_id, foreign.delegationId);
      assert.equal(persisted.order, 1);
    });

    await t.test("cross-delegation associations and administrator escalation are rejected", async () => {
      const invalidShift = validated(dto.ShiftEntityDto, "create", { ambulanceId: ambulance.id, guardId: foreignGuard.id, paramedicalId: byRole("paramedical").id, driverId: byRole("vehicle_operator").id });
      await denied(() => shifts.createShift(general, invalidShift, general.id), "DELEGATION_MISMATCH");
      const userData = { name: tag, lastname: "Test", email: `${tag}@example.test`, password: process.env.USER_PASSWORD_SEED, role: "general_admin", position: "Test", delegationId: local.delegationId };
      await denied(() => adm.createUser(local, validated(dto.UserEntityDto, "create", userData), local.id), "ADMIN_ROLE_RESTRICTED");
      const promote = { ...userData, id: byRole("paramedical").id, status: true };
      await denied(() => adm.editUser(local, validated(dto.UserEntityDto, "edit", promote), local.id), "ADMIN_ROLE_RESTRICTED");
      await denied(() => adm.deleteUser(local, general.id, local.id), "ADMIN_ROLE_RESTRICTED");
      const invalidChecklist = validated(dto.CheckListAmbulanceEntityDto, "create", { ambulanceId: foreignAmbulance.id, shiftId: shift.id, km: 42 });
      await denied(() => checklists.createAmbChecklist(general, invalidChecklist, general.id), "DELEGATION_MISMATCH");
    });

    const supplyValues = { category: tag, specification: "Test", avaible_quantity: 5, min_quantity: 3, expiration_date: new Date("2027-10-10"), measurement_unit: "unit", area_id: 1 };
    const ambSupply = await create("SupplyAmbulance", { ...supplyValues, ambulance_id: ambulance.id });
    const foreignSupply = await create("SupplyAmbulance", { ...supplyValues, ambulance_id: foreignAmbulance.id });
    const pharmacySupply = await create("Supply", { category: tag, avaible_quantity: 10, expiration_date: new Date("2027-10-10"), measurement_unit: "unit", pharmacy_id: pharmacy.id });
    const ownPharmacySupply = await create("Supply", { category: tag, avaible_quantity: 10, expiration_date: new Date("2027-10-10"), measurement_unit: "unit", pharmacy_id: localPharmacy.id });
    const checklist = await result("ChecklistAmbulance", checklists.createAmbChecklist(local, validated(dto.CheckListAmbulanceEntityDto, "create", { ambulanceId: ambulance.id, shiftId: shift.id, km: 42 }), local.id));
    const foreignChecklist = await result("ChecklistAmbulance", checklists.createAmbChecklist(foreign, validated(dto.CheckListAmbulanceEntityDto, "create", { ambulanceId: foreignAmbulance.id, shiftId: foreignShift.id, km: 42 }), foreign.id));
    const supChecklist = await result("ChecklistSupply", checklists.createSupChecklist(local, validated(dto.CheckListSupplyEntityDto, "create", { shiftId: shift.id }), local.id));
    const foreignSupChecklist = await result("ChecklistSupply", checklists.createSupChecklist(foreign, validated(dto.CheckListSupplyEntityDto, "create", { shiftId: foreignShift.id }), foreign.id));

    await t.test("ambulance supplies support optional pagination, stable totals and empty pages", async () => {
      const secondSupply = await create("SupplyAmbulance", { ...supplyValues, category: `${tag}-second`, ambulance_id: ambulance.id });
      const emptyAmbulance = await create("Ambulance", { number: `${tag}-empty`, brand: "Test", model: "Test", delegation_id: local.delegationId });
      const noPagination = validated(dto.PaginationDto, "validate", {});
      const all = await ambulances.getAmbSupplies(local, ambulance.id, noPagination);
      assert.equal(all.total, 2);
      assert.equal(all.data.length, 2);
      assert.ok(all.data.some((entry) => entry.id === ambSupply.id));
      assert.ok(all.data.some((entry) => entry.id === secondSupply.id));
      const first = await ambulances.getAmbSupplies(local, ambulance.id, validated(dto.PaginationDto, "validate", { limit: "1", offset: "0" }));
      const second = await ambulances.getAmbSupplies(local, ambulance.id, validated(dto.PaginationDto, "validate", { limit: "1", offset: "1" }));
      assert.equal(first.total, 2);
      assert.equal(second.total, 2);
      assert.deepEqual([...first.data, ...second.data].map((entry) => entry.id), all.data.map((entry) => entry.id));
      const beyond = await ambulances.getAmbSupplies(local, ambulance.id, validated(dto.PaginationDto, "validate", { limit: "1", offset: "999" }));
      assert.deepEqual(beyond, { success: true, data: [], total: 2 });
      assert.deepEqual(await ambulances.getAmbSupplies(local, emptyAmbulance.id, noPagination), { success: true, data: [], total: 0 });
      await denied(() => ambulances.getAmbSupplies(local, foreignAmbulance.id, noPagination), "AMBULANCE_NOT_FOUND");
    });

    await t.test("indirect resource lookups and the reserved checklist GETs enforce scope", async () => {
      await denied(() => checklists.getAmbChecklist(local, foreignChecklist.id), "CHECKLIST_AMBULANCE_NOT_FOUND");
      await denied(() => checklists.getSupChecklist(local, foreignSupChecklist.id), "CHECKLIST_SUPPLY_NOT_FOUND");
      await denied(() => supplies.getOneSupply(local, pharmacySupply.id), "SUPPLIES_NOT_FOUND");
      assert.equal((await supplies.getOneSupply(local, ownPharmacySupply.id)).data.id, ownPharmacySupply.id);
      await denied(() => checklists.putSupAnswers(local, { checklistId: supChecklist.id, answers: [{ supplyId: foreignSupply.id, reportedQuantity: 1 }] }, local.id), "SUPPLY_NOT_FOUND");
      await denied(() => checklists.putAmbAnswers(general, { checklistAmbulanceId: checklist.id, answers: [{ questionId: foreignQuestion.id, type: "bool", valueBool: true }] }, general.id), "DELEGATION_MISMATCH");
      const invalidSupply = validated(dto.SupplyAmbEntityDto, "create", { ambulanceId: ambulance.id, supplyId: pharmacySupply.id, avaibleQuantity: 1, minQuantity: 1, areaId: 1 });
      await denied(() => ambulances.addSupply(general, invalidSupply, general.id), "DELEGATION_MISMATCH");
      const invalidSign = validated(dto.CheckListSupplyEntityDto, "sign", { id: supChecklist.id, delivererId: local.id, recipientId: foreign.id });
      await denied(() => checklists.signSupChecklist(general, invalidSign, general.id), "DELEGATION_MISMATCH");
    });

    await t.test("checklist answers, signatures, replenishment and territorial logs work together", async () => {
      await checklists.putAmbAnswers(local, { checklistAmbulanceId: checklist.id, answers: [{ questionId: question.id, type: "bool", valueBool: true }] }, local.id);
      await checklists.putSupAnswers(local, { checklistId: supChecklist.id, answers: [{ supplyId: ambSupply.id, reportedQuantity: 1 }] }, local.id);
      await checklists.signSupChecklist(local, validated(dto.CheckListSupplyEntityDto, "sign", { id: supChecklist.id, delivererId: local.id, recipientId: byRole("paramedical").id }), local.id);
      const report = remember("SupplyReport", await db.SupplyReport.findOne({ where: { checklist_id: supChecklist.id } }));
      const item = await db.SupplyReportItem.findOne({ where: { report_id: report.id } });
      assert.equal(item.required_quantity, 2);
      const update = validated(dto.SupplyReportEntityDto, "updateSupplies", { params: { id: report.id }, body: { items: [{ itemId: item.id, addedQuantity: 2 }] } });
      await reports.updateSupplies(local, update, local.id);
      await reports.attendReport(local, report.id, local.id);
      const reportDetail = await reports.getReport(local, report.id);
      assert.equal(reportDetail.data.status, "attended");
      const expectedDelegation = {
        id: local.delegationId,
        name: (await db.Delegation.findByPk(local.delegationId)).name,
        pharmacy: { id: localPharmacy.id },
      };
      assert.deepEqual(reportDetail.data.delegation, expectedDelegation);
      const reportList = await reports.getReports(local, pagination());
      assert.deepEqual(reportList.data.find((entry) => entry.id === report.id).delegation, expectedDelegation);
      assert.equal(reportList.total, 1);
      // The report's territory must not be replaced by the requesting administrator's.
      assert.deepEqual((await reports.getReport({ ...general, delegationId: foreign.delegationId }, report.id)).data.delegation, expectedDelegation);
      assert.equal((await reports.getReports(foreign, pagination())).total, 0);
      await denied(() => reports.getReport(foreign, report.id), "SUPPLY_REPORT_NOT_FOUND");
      const logFilter = validated(dto.FindLogsDto, "validate", { limit: "100" });
      const localLogs = await logs.findAll(local, logFilter);
      assert.ok(!localLogs.data.some((entry) => entry.affected === foreignCategory.id));
      const foreignLogs = await logs.findAll(foreign, logFilter);
      assert.ok(foreignLogs.data.some((entry) => entry.affected === foreignCategory.id && entry.userId === general.id));
      assert.ok(!foreignLogs.data.some((entry) => entry.affected === category.id));
      assert.equal(await db.Log.count({ where: { delegation_id: null } }), 0);
      // The stored event territory remains independent from its author's territory.
      assert.equal(await new DelegationScope(general).delegationOf("SupplyReport", report.id), local.delegationId);
    });

    await t.test("only the general administrator can create an administrator in another delegation", async () => {
      const input = validated(dto.UserEntityDto, "create", {
        name: tag, lastname: "Admin", email: `${tag}@example.test`,
        password: process.env.USER_PASSWORD_SEED, role: "admin", position: "Test",
        delegationId: foreign.delegationId,
      });
      const administrator = await result("User", adm.createUser(general, input, general.id));
      assert.equal(administrator.role, "admin");
      assert.equal(administrator.delegation_id, foreign.delegationId);
      await denied(() => adm.changePasswordUser(local, administrator.id, process.env.USER_PASSWORD_SEED, local.id), "DELEGATION_ACCESS_DENIED");
      const shiftChange = validated(dto.ShiftEntityDto, "edit", {
        id: shift.id, name: tag, ambulanceId: foreignAmbulance.id, guardId: guard.id,
        paramedicalId: byRole("paramedical").id, driverId: byRole("vehicle_operator").id,
      });
      await denied(() => shifts.editShift(general, shiftChange, general.id), "DELEGATION_MISMATCH");
      const userMove = validated(dto.UserEntityDto, "edit", {
        id: byRole("paramedical").id, name: byRole("paramedical").name,
        lastname: byRole("paramedical").lastname, email: byRole("paramedical").email,
        role: "paramedical", position: byRole("paramedical").position,
        delegationId: foreign.delegationId, status: true,
      });
      await denied(() => adm.editUser(general, userMove, general.id), "DELEGATION_MISMATCH");
    });

    await t.test("HTTP authentication reloads role and delegation and preserves response contracts", async () => {
      process.env.VERCEL = "1"; // Import the app without starting its production listener.
      const app = require("../src/index").default;
      const server = await new Promise((resolve) => {
        const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
      });
      try {
        const url = `http://127.0.0.1:${server.address().port}`;
        const token = await db.JwtAdapter.generateToken({ id: local.id, role: "general_admin", delegationId: foreign.delegationId }, "5m", "ACCESS");
        const headers = { Authorization: `Bearer ${token}` };
        const blocked = await fetch(`${url}/api/delegations/states`, { headers });
        assert.equal(blocked.status, 403);
        assert.deepEqual(await blocked.json(), { success: false, error: "UNAUTHORIZED_RANK" });
        const response = await fetch(`${url}/api/adm/get-all/users?role=admin`, { headers });
        assert.equal(response.status, 200);
        const data = await response.json();
        assert.deepEqual(Object.keys(data).sort(), ["data", "success", "total"]);
        assert.equal(data.total, 1);
        assert.equal(data.data[0].delegation.id, local.delegationId);
        assert.ok(!("delegationId" in data.data[0]));
        const login = await fetch(`${url}/api/auth/login/user`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "admindelegacionseed@vitalgest.mx", password: process.env.USER_PASSWORD_SEED }),
        });
        assert.equal(login.status, 200);
        const loginData = await login.json();
        assert.equal(loginData.data.role, "admin");
        assert.equal(loginData.data.delegationId, local.delegationId);
        assert.ok(!("accessToken" in loginData));
        assert.ok(login.headers.get("set-cookie").includes("refresh"));
        const reportId = (await db.SupplyReport.findOne({ where: { checklist_id: supChecklist.id } })).id;
        const httpReport = await (await fetch(`${url}/api/supply-reports/${reportId}`, { headers })).json();
        const httpReports = await (await fetch(`${url}/api/supply-reports`, { headers })).json();
        assert.equal(httpReport.data.delegation.id, local.delegationId);
        assert.equal(httpReport.data.delegation.pharmacy.id, localPharmacy.id);
        assert.deepEqual(httpReports.data.find((entry) => entry.id === reportId).delegation, httpReport.data.delegation);
        const suppliesResponse = await fetch(`${url}/api/ambulances/supplies/${ambulance.id}?limit=1&offset=0`, { headers });
        assert.equal(suppliesResponse.status, 200);
        const suppliesPage = await suppliesResponse.json();
        assert.equal(suppliesPage.total, 2);
        assert.equal(suppliesPage.data.length, 1);
        for (const [query, error] of [["limit=0", "INVALID_LIMIT"], ["offset=-1", "INVALID_OFFSET"]]) {
          const invalid = await fetch(`${url}/api/ambulances/supplies/${ambulance.id}?${query}`, { headers });
          assert.equal(invalid.status, 400);
          assert.deepEqual(await invalid.json(), { success: false, error });
        }
        const documentation = await (await fetch(`${url}/api/docs.json`)).json();
        const listExample = documentation.paths["/api/supply-reports"].get.responses["200"].content["application/json"].example;
        const detailExample = documentation.paths["/api/supply-reports/{id}"].get.responses["200"].content["application/json"].example;
        assert.deepEqual(listExample.data[0].delegation, detailExample.data.delegation);
        assert.ok(detailExample.data.delegation.pharmacy.id);
        assert.ok(documentation.paths["/api/questions"].post.responses["403"]);
        for (const path of ["/api/dev/seed", "/api/dev/seed-questions"]) {
          assert.equal((await fetch(url + path, { method: "POST" })).status, 404);
        }
      } finally {
        await new Promise((resolve) => server.close(resolve));
      }
    });
  } finally {
    // Remove only fixture IDs and their dependent records, preserving all seed data.
    const ids = (model) => created.get(model) ?? [];
    const affected = [...created.values()].flat();
    if (affected.length) await db.Log.destroy({ where: { affected: { [Op.in]: affected } } });
    for (const model of ["SupplyReport", "ChecklistAmbulance", "ChecklistSupply", "Question", "QuestionSubcategory", "QuestionCategory", "SupplyAmbulance", "Supply", "Shift", "Guard", "Ambulance", "Pharmacy", "User", "Delegation"]) {
      if (ids(model).length) await db[model].destroy({ where: { id: { [Op.in]: ids(model) } } });
    }
    try {
      for (const [model, count] of baseline) assert.equal(await db[model].count(), count, `Fixture cleanup preserved ${model}`);
    } finally {
      await db.sequelize.close();
    }
  }
});
