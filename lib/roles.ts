// User role definitions and access control
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR', 
  PHARMACIST = 'PHARMACIST',
  MLT = 'MLT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  PHARMACY_ADMIN = 'PHARMACY_ADMIN',
  LAB_ADMIN = 'LAB_ADMIN',
  INSURANCE_ADMIN = 'INSURANCE_ADMIN',
  INSURANCE_AGENT = 'INSURANCE_AGENT'
}

// Role mapping for URL routes (lowercase) - Dashboard access only
// PATIENT and INSURANCE_AGENT are restricted to mobile app only
export const ROLE_ROUTES: Record<string, UserRole[]> = {
  'doctor': [UserRole.DOCTOR],
  'pharmacist': [UserRole.PHARMACIST],
  'mlt': [UserRole.MLT],
  'admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  'hospital': [UserRole.HOSPITAL_ADMIN],
  'pharmacy': [UserRole.PHARMACY_ADMIN],
  'lab': [UserRole.LAB_ADMIN],
  'insurer': [UserRole.INSURANCE_ADMIN]
};

// Reverse mapping: Role to route (only for dashboard-accessible roles)
export const ROLE_TO_ROUTE: Record<UserRole, string | null> = {
  [UserRole.PATIENT]: null, // Mobile app only
  [UserRole.DOCTOR]: 'doctor',
  [UserRole.PHARMACIST]: 'pharmacist',
  [UserRole.MLT]: 'mlt',
  [UserRole.ADMIN]: 'admin',
  [UserRole.SUPER_ADMIN]: 'admin',
  [UserRole.HOSPITAL_ADMIN]: 'hospital',
  [UserRole.PHARMACY_ADMIN]: 'pharmacy',
  [UserRole.LAB_ADMIN]: 'lab',
  [UserRole.INSURANCE_ADMIN]: 'insurer',
  [UserRole.INSURANCE_AGENT]: null // Mobile app only
};

// Role hierarchy and permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.PATIENT]: [
    'view_appointments',
    'book_appointments',
    'view_prescriptions',
    'view_lab_results',
    'view_medical_records',
    'chat_with_doctor'
  ],
  [UserRole.DOCTOR]: [
    'view_patients',
    'create_prescriptions',
    'view_appointments',
    'manage_appointments',
    'view_lab_results',
    'create_medical_records',
    'chat_with_patients'
  ],
  [UserRole.PHARMACIST]: [
    'view_prescriptions',
    'dispense_medications',
    'manage_inventory',
    'view_pharmacy_orders'
  ],
  [UserRole.MLT]: [
    'view_lab_tests',
    'create_lab_results',
    'manage_lab_samples',
    'view_lab_queue'
  ],
  [UserRole.ADMIN]: [
    'manage_users',
    'view_system_analytics',
    'manage_organizations',
    'system_configuration'
  ],
  [UserRole.SUPER_ADMIN]: [
    'full_system_access',
    'manage_admins',
    'system_maintenance',
    'audit_logs'
  ],
  [UserRole.HOSPITAL_ADMIN]: [
    'manage_hospital',
    'manage_hospital_staff',
    'view_hospital_analytics',
    'manage_departments'
  ],
  [UserRole.PHARMACY_ADMIN]: [
    'manage_pharmacy',
    'manage_pharmacy_staff',
    'view_pharmacy_analytics',
    'manage_inventory_admin'
  ],
  [UserRole.LAB_ADMIN]: [
    'manage_laboratory',
    'manage_lab_staff',
    'view_lab_analytics',
    'manage_lab_equipment'
  ],
  [UserRole.INSURANCE_ADMIN]: [
    'manage_insurance_company',
    'view_claims',
    'manage_policies',
    'view_insurance_analytics'
  ],
  [UserRole.INSURANCE_AGENT]: [
    'process_claims',
    'view_policies',
    'customer_support'
  ]
};

// Check if user has permission
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission) || permissions.includes('full_system_access');
}

// Check if user can access route
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const allowedRoles = ROLE_ROUTES[route] || [];
  return allowedRoles.includes(userRole);
}

// Get default route for user role (null if mobile-only)
export function getDefaultRoute(userRole: UserRole): string | null {
  return ROLE_TO_ROUTE[userRole];
}

// Get all valid routes
export function getValidRoutes(): string[] {
  return Object.keys(ROLE_ROUTES);
}

// Check if role requires profile completion
export function requiresProfile(userRole: UserRole): boolean {
  return [
    UserRole.DOCTOR,
    UserRole.PHARMACIST,
    UserRole.MLT,
    UserRole.PATIENT
  ].includes(userRole);
}

// Check if role requires organization affiliation
export function requiresOrganization(userRole: UserRole): boolean {
  return [
    UserRole.HOSPITAL_ADMIN,
    UserRole.PHARMACY_ADMIN,
    UserRole.LAB_ADMIN,
    UserRole.INSURANCE_ADMIN,
    UserRole.INSURANCE_AGENT
  ].includes(userRole);
}

// Check if role has dashboard access
export function hasDashboardAccess(userRole: UserRole): boolean {
  return ROLE_TO_ROUTE[userRole] !== null;
}