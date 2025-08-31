
// definición de los roles como un obj
export const ROLE = {
  PARAMEDICAL: 'paramedical',
  VEHICLE_OPERATOR: 'vehicle_operator',
  HEAD_GUARD: 'head_guard',
  ADMIN: 'admin',
  GENERAL_ADMIN: 'general_admin'
} as const;

// lista de roles segun los valores del objeto ROLE
export const ROLE_LIST = Object.values(ROLE) as string[];

// tipeo de los valores del obj ROLE en Role
export type Role = typeof ROLE[keyof typeof ROLE];

// asignación númerica de cada rol 
export const ROLE_RANK: Record<Role, number> = {
  paramedical: 10,
  vehicle_operator: 20,
  head_guard: 30,
  admin: 40,
  general_admin: 50,
};