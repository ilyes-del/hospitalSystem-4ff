// Authentication types for the hospital management system

export interface LoginCredentials {
  username: string
  password: string
  hospitalCode?: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  full_name: string
  role: "admin" | "doctor" | "nurse" | "pharmacist" | "receptionist"
  department?: string
  hospital_id: string
  hospital_name: string
  hospital_code: string
  permissions: string[]
}

export interface AuthSession {
  user: AuthUser
  token: string
  expires_at: string
}

export interface AuthContextType {
  user: AuthUser | null
  session: AuthSession | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  hasPermission: (permission: string) => boolean
  hasRole: (role: string | string[]) => boolean
}

// Role-based permissions
export const PERMISSIONS = {
  // Patient management
  VIEW_PATIENTS: "view_patients",
  CREATE_PATIENTS: "create_patients",
  EDIT_PATIENTS: "edit_patients",
  DELETE_PATIENTS: "delete_patients",

  // Appointments
  VIEW_APPOINTMENTS: "view_appointments",
  CREATE_APPOINTMENTS: "create_appointments",
  EDIT_APPOINTMENTS: "edit_appointments",
  CANCEL_APPOINTMENTS: "cancel_appointments",

  // Medical records
  VIEW_MEDICAL_RECORDS: "view_medical_records",
  CREATE_MEDICAL_RECORDS: "create_medical_records",
  EDIT_MEDICAL_RECORDS: "edit_medical_records",

  // Inventory
  VIEW_INVENTORY: "view_inventory",
  MANAGE_INVENTORY: "manage_inventory",
  VIEW_STOCK_REPORTS: "view_stock_reports",

  // Administration
  MANAGE_USERS: "manage_users",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  MANAGE_HOSPITAL_SETTINGS: "manage_hospital_settings",

  // National sync
  SYNC_NATIONAL_DB: "sync_national_db",
  VIEW_REFERRALS: "view_referrals",
  CREATE_REFERRALS: "create_referrals",
} as const

export const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.EDIT_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENTS,
    PERMISSIONS.EDIT_APPOINTMENTS,
    PERMISSIONS.CANCEL_APPOINTMENTS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.VIEW_STOCK_REPORTS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.MANAGE_HOSPITAL_SETTINGS,
    PERMISSIONS.SYNC_NATIONAL_DB,
    PERMISSIONS.VIEW_REFERRALS,
    PERMISSIONS.CREATE_REFERRALS,
  ],
  doctor: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.EDIT_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENTS,
    PERMISSIONS.EDIT_APPOINTMENTS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.CREATE_MEDICAL_RECORDS,
    PERMISSIONS.EDIT_MEDICAL_RECORDS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.VIEW_REFERRALS,
    PERMISSIONS.CREATE_REFERRALS,
  ],
  nurse: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENTS,
    PERMISSIONS.EDIT_APPOINTMENTS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.CREATE_MEDICAL_RECORDS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.VIEW_REFERRALS,
  ],
  pharmacist: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.VIEW_MEDICAL_RECORDS,
    PERMISSIONS.VIEW_INVENTORY,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.VIEW_STOCK_REPORTS,
  ],
  receptionist: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.EDIT_PATIENTS,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENTS,
    PERMISSIONS.EDIT_APPOINTMENTS,
    PERMISSIONS.CANCEL_APPOINTMENTS,
  ],
} as const
