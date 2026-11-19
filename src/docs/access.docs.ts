import * as routes from "../presentation";

const mounts = {
  admRoutes: "adm", authRoutes: "auth", delegationsRoutes: "delegations",
  guardsRoutes: "guards", ambulancesRoutes: "ambulances", shiftRoutes: "shifts",
  checklistsRoutes: "checklists", suppliesRoutes: "supplies",
  supplyReportsRoutes: "supply-reports", userRoutes: "user", questionsRoutes: "questions", logsRoutes: "logs",
} as const;

const normalize = (path: string) => path.replace(/\{[^}]+\}/g, "{}").replace(/\/$/, "");

/** Keep published permissions aligned with the middleware actually registered on each route. */
export function applyAccessDocumentation(spec: any) {
  for (const [name, mount] of Object.entries(mounts)) {
    const router = routes[name as keyof typeof mounts] as any;
    for (const layer of router.stack) {
      const route = layer.route;
      if (!route) continue;
      const allowed = route.stack.find((entry: any) => entry.handle.allowedRoles)?.handle.allowedRoles;
      if (!allowed) continue;
      const path = `/api/${mount}${route.path}`.replace(/:([^/]+)/g, "{$1}").replace(/\/$/, "");
      const documentedPath = Object.keys(spec.paths).find((key) => normalize(key) === normalize(path)) ?? path;
      for (const method of Object.keys(route.methods)) {
        const operation = spec.paths[documentedPath]?.[method];
        if (!operation) throw new Error(`Falta documentación de ${method.toUpperCase()} ${path}`);
        const globalCatalog = path === "/api/ambulances/areas" || path === "/api/logs/filters";
        const personal = mount === "user";
        const scope = globalCatalog ? "Catálogo global compartido." : personal
          ? "Solo el propio usuario, incluidos los administradores."
          : "Usuarios distintos de general_admin: únicamente su delegación, obtenida de la base de datos. general_admin: acceso entre delegaciones, conservando la coherencia territorial de los recursos relacionados.";
        operation.description = `${operation.description ?? ""}\n\nRoles permitidos: ${allowed.join(", ")}. ${scope}`.trim();
        if (path === "/api/questions/categories" && method === "post") {
          operation.description += " La nueva categoría se asigna a la delegación del usuario creador, incluido general_admin. Los nombres y posiciones son únicos por delegación. No se requiere un campo adicional en el body.";
        }
        if ((path === "/api/questions/subcategories" || path === "/api/questions") && method === "post") {
          operation.description += " La delegación se hereda de la categoría seleccionada. No se requiere un campo adicional en el body.";
        }
        if (mount === "logs" && !globalCatalog) {
          operation.description += " El alcance corresponde a la delegación registrada en el evento, no a la delegación actual de su autor. El campo de delegación es interno y no modifica la respuesta.";
        }
        operation["x-allowed-roles"] = allowed;
        operation.security = [{ bearerAuth: [] }];
        operation.responses ??= {};
        operation.responses["403"] = {
          description: "Acceso denegado: UNAUTHORIZED_RANK, DELEGATION_ACCESS_DENIED, DELEGATION_MISMATCH o ADMIN_ROLE_RESTRICTED. Un recurso ajeno también puede responder con el error de recurso no encontrado existente (400 o 404), sin revelar sus datos.",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
        };
      }
    }
  }
}
