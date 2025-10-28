
// rutas
export { default as authRoutes } from './routes/auth.routes';
export { default as admRoutes } from './routes/adm.routes';
export { default as delegationsRoutes } from './routes/delegations.routes';
export { default as guardsRoutes } from './routes/guards.routes';
export { default as devRoutes } from './routes/dev/dev.routes'
export { default as ambulancesRoutes } from './routes/ambulance.routes'
export { default as shiftRoutes } from './routes/shift.routes'
export { default as checklistsRoutes } from './routes/checklists.routes'

// controladores
export * from './controllers/adm.controller'
export * from './controllers/auth.controller'