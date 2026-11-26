const { test } = require("node:test");
const assert = require("node:assert/strict");
const { Op } = require("sequelize");
const expected = require("./fixtures/endpoint-permissions.json");
const { PermissionMiddleware } = require("../src/infrastructure/middlewares/permission.middleware");
const { DelegationScope } = require("../src/infrastructure/helpers/delegation-scope");
const { CustomError } = require("../src/application/errors/custom.error");

// Capture metadata without replacing the actual authorization behavior.
const allow = PermissionMiddleware.allow;
PermissionMiddleware.allow = (...roles) => Object.assign(allow(...roles), { allowedRoles: roles });
const routes = require("../src/presentation");
const mounts = {
  admRoutes: "adm", authRoutes: "auth", delegationsRoutes: "delegations",
  guardsRoutes: "guards", ambulancesRoutes: "ambulances", shiftRoutes: "shifts",
  checklistsRoutes: "checklists", suppliesRoutes: "supplies",
  supplyReportsRoutes: "supply-reports", userRoutes: "user", questionsRoutes: "questions", logsRoutes: "logs",
};
const roles = ["general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"];

test("all 78 endpoints match the approved matrix, including the four reserved policies", () => {
  const found = new Set();
  for (const [exportName, mount] of Object.entries(mounts)) {
    for (const layer of routes[exportName].stack) {
      if (!layer.route) continue;
      const route = layer.route;
      for (const method of Object.keys(route.methods)) {
        const path = `/api/${mount}${route.path}`.replace(/\/$/, "").replace(/:[^/]+/g, ":id");
        const key = `${method.toUpperCase()} ${path}`;
        const policy = route.stack.find((entry) => entry.handle.allowedRoles)?.handle;
        found.add(key);
        if (mount === "auth") { assert.equal(policy, undefined); continue; }
        assert.ok(policy, `Missing policy: ${key}`);
        assert.deepEqual(policy.allowedRoles, expected[key], key);
        for (const role of roles) {
          let calls = 0, error;
          policy({ user: { role } }, {}, (e) => { calls++; error = e; });
          assert.equal(calls, 1, `${key} ${role}: exactly one next()`);
          assert.equal(error?.statusCode, expected[key].includes(role) ? undefined : 403, `${key} ${role}`);
        }
      }
    }
  }
  assert.equal(found.size, 78);
  for (const key of Object.keys(expected)) assert.ok(found.has(key), key);
});

test("higher rank does not grant checklist permissions", () => {
  const handler = allow("general_admin", "admin", "vehicle_operator");
  let error;
  handler({ user: { role: "head_guard" } }, {}, (e) => { error = e; });
  assert.equal(error.statusCode, 403);
  handler({}, {}, (e) => { error = e; });
  assert.equal(error.statusCode, 401);
});

test("scope combines role filters with territory and fails closed without a delegation", () => {
  const scope = new DelegationScope({ id: "u", role: "admin", delegationId: "d" });
  const conditions = scope.where("User", { role: "vehicle_operator" });
  assert.deepEqual(conditions[Op.and], [{ role: "vehicle_operator" }, { delegation_id: "d" }]);
  assert.deepEqual(scope.where("Delegation")[Op.and][1], { id: "d" });
  for (const resource of ["Shift", "Supply", "SupplyAmbulance", "ChecklistAmbulance", "ChecklistSupply", "SupplyReport", "SupplyReportItem"]) {
    assert.ok(scope.where(resource)[Op.and][1].id[Op.in]);
  }
  assert.throws(() => new DelegationScope({ role: "admin" }).where("User"), (e) => e === "DELEGATION_ACCESS_DENIED");
});

test("general administrators bypass visibility limits but not relationship consistency", () => {
  const scope = new DelegationScope({ role: "general_admin", delegationId: "a" });
  assert.deepEqual(scope.where("User", { id: "foreign" }), { id: "foreign" });
  assert.doesNotThrow(() => scope.assertDelegation("b"));
  assert.throws(() => DelegationScope.same("a", "b"), (e) => e === "DELEGATION_MISMATCH");
  assert.throws(() => DelegationScope.same("", ""), (e) => e === "DELEGATION_MISMATCH");
});

test("authorization errors retain the existing envelope and use HTTP 403", () => {
  for (const code of ["DELEGATION_ACCESS_DENIED", "DELEGATION_MISMATCH", "ADMIN_ROLE_RESTRICTED"]) {
    assert.equal(CustomError.from(code).statusCode, 403);
    assert.equal(CustomError.badRequest(code).message, code);
  }
  const error = new CustomError(403, "UNAUTHORIZED_RANK");
  assert.equal(CustomError.from(error), error);
});

test("Swagger documents the same 78 operations and their authorization failures", () => {
  const { swaggerSpec } = require("../src/docs/swagger");
  let count = 0;
  for (const [path, methods] of Object.entries(swaggerSpec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;
      count++;
      const key = `${method.toUpperCase()} ${path.replace(/\{[^}]+\}/g, ":id")}`;
      assert.ok(expected[key], key);
      if (path.startsWith("/api/auth/")) continue;
      assert.deepEqual(operation["x-allowed-roles"], expected[key], key);
      assert.ok(operation.responses["403"], key);
    }
  }
  assert.equal(count, 78);
});


test("ambulance supply pagination is documented and validates the same limits as pharmacy", async () => {
  const { swaggerSpec } = require("../src/docs/swagger");
  const operation = swaggerSpec.paths["/api/ambulances/supplies/{ambulanceId}"].get;
  const limit = operation.parameters.find((parameter) => parameter.name === "limit");
  const offset = operation.parameters.find((parameter) => parameter.name === "offset");
  assert.equal(limit.required, false);
  assert.equal(limit.schema.minimum, 1);
  assert.equal(offset.required, false);
  assert.equal(offset.schema.minimum, 0);
  assert.ok(operation.responses["200"].content["application/json"].schema.required.includes("total"));
  const { AmbulancesController } = require("../src/presentation/controllers/ambulances.controller");
  const id = "11111111-1111-4111-8111-111111111111";
  const actor = { id: "user", role: "admin", delegationId: "delegation" };
  const controller = new AmbulancesController({
    getAmbSupplies: async (user, ambulanceId, pagination) => {
      assert.equal(user, actor);
      assert.equal(ambulanceId, id);
      assert.equal(pagination.limit, 1);
      assert.equal(pagination.offset, 2);
      return { success: true, data: [], total: 2 };
    },
  });
  for (const [query, code] of [[{ limit: "0" }, "INVALID_LIMIT"], [{ offset: "-1" }, "INVALID_OFFSET"]]) {
    assert.throws(() => controller.getAmbSupplies({ params: { id }, query, user: actor }, {}, () => {}), (error) => error.statusCode === 400 && error.message === code);
  }
  const response = await new Promise((resolve, reject) => controller.getAmbSupplies(
    { params: { id }, query: { limit: "1", offset: "2" }, user: actor },
    { json: resolve }, reject,
  ));
  assert.deepEqual(response, { success: true, data: [], total: 2 });
});

test("signing a supply checklist creates a report only when shortages exist", async (t) => {
  const db = require("../src/infrastructure");
  const { ChecklistsService } = require("../src/presentation/services/checklists.service");
  const { LogsService } = require("../src/presentation/services/logs.service");
  const userId = "11111111-1111-4111-8111-111111111111";
  const checklistId = "22222222-2222-4222-8222-222222222222";
  const reportId = "33333333-3333-4333-8333-333333333333";
  const shortage = {
    id: "44444444-4444-4444-8444-444444444444",
    category: "Mascarilla", specification: "Adulto", measurement_unit: "unit",
    min_quantity: 3, reported_quantity: 1, required_quantity: 2, area_id: 1,
    area: { name: "Vías aéreas", section: "Gabinete 1", order: 1 },
  };

  for (const scenario of [
    { name: "without shortages", missing: [], existing: null, generated: false },
    { name: "with shortages", missing: [shortage], existing: null, generated: true },
    { name: "with an existing report", missing: [shortage], existing: { id: reportId }, generated: false },
  ]) {
    await t.test(scenario.name, async (t) => {
      let signed = false, committed = false, rolledBack = false, queriedShortages = false;
      const reports = [], items = [], logs = [];
      const tx = { LOCK: { UPDATE: "UPDATE" }, commit: async () => { committed = true; }, rollback: async () => { rolledBack = true; } };
      t.mock.method(db.sequelize, "transaction", async () => tx);
      t.mock.method(DelegationScope.prototype, "delegationOf", async () => "delegation");
      t.mock.method(db.ChecklistSupply, "findOne", async () => ({
        id: checklistId, shift_id: "shift", update: async () => { signed = true; },
      }));
      t.mock.method(db.Shift, "findOne", async () => ({ ambulance_id: "ambulance" }));
      t.mock.method(db.User, "findOne", async () => ({ id: userId, signature: null }));
      t.mock.method(db.SupplyReport, "findOne", async () => scenario.existing);
      t.mock.method(db.AnswerSupply, "findAll", async (options) => {
        queriedShortages = true;
        assert.equal(options.where.required_quantity[Op.gt], 0);
        return scenario.missing;
      });
      t.mock.method(db.SupplyReport, "create", async (values, options) => {
        assert.equal(options.transaction, tx);
        reports.push(values);
        return { id: reportId };
      });
      t.mock.method(db.SupplyReportItem, "bulkCreate", async (values, options) => {
        assert.equal(options.transaction, tx);
        items.push(...values);
      });
      t.mock.method(LogsService.prototype, "create", async (entry) => { logs.push(entry); });

      const response = await new ChecklistsService().signSupChecklist(
        { id: userId, role: "admin", delegationId: "delegation" },
        { id: checklistId, recipientId: userId, delivererId: userId }, userId,
      );
      assert.deepEqual(response, { success: true });
      assert.equal(signed, true);
      assert.equal(committed, true);
      assert.equal(rolledBack, false);
      assert.equal(reports.length, scenario.generated ? 1 : 0);
      assert.equal(items.length, scenario.generated ? 1 : 0);
      assert.equal(queriedShortages, !scenario.existing);
      assert.equal(logs.filter((entry) => entry.action === "CREATE_SUPPLY_REPORT").length, scenario.generated ? 1 : 0);
      assert.ok(logs.some((entry) => entry.action === "SIGN_SUPPLY_CHECKLIST" && entry.description.includes(`Reporte generado en esta operación: ${scenario.generated ? "Sí" : "No"}.`)));
      if (scenario.generated) assert.equal(items[0].checklist_answer_id, shortage.id);
    });
  }
});
