// Database types for National Hospital Management System

export interface Hospital {
  id: string
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  region?: string
  type: "public" | "private" | "military" | "specialized"
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  hospital_id: string
  username: string
  email: string
  hashed_password: string
  full_name: string
  role: "admin" | "doctor" | "nurse" | "pharmacist" | "receptionist"
  department?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  nin: string // National Identity Number
  full_name: string
  date_of_birth: string
  gender: "M" | "F"
  contact_hash?: string
  phone_encrypted?: string
  address_encrypted?: string
  primary_hospital_id?: string
  consent_flags: Record<string, boolean>
  emergency_contact_encrypted?: string
  blood_type?: string
  allergies?: string[]
  chronic_conditions?: string[]
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_nin: string
  hospital_id: string
  doctor_id?: string
  department: string
  appointment_type?: "consultation" | "follow-up" | "emergency"
  scheduled_at: string
  duration_minutes: number
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show"
  priority_level: 1 | 2 | 3 // 1=routine, 2=urgent, 3=emergency
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Visit {
  id: string
  patient_nin: string
  hospital_id: string
  appointment_id?: string
  department: string
  arrival_time: string
  triage_level?: 1 | 2 | 3 | 4 // 1=non-urgent, 4=emergency
  chief_complaint?: string
  vital_signs?: {
    temperature?: number
    blood_pressure?: string
    heart_rate?: number
    respiratory_rate?: number
    oxygen_saturation?: number
  }
  diagnosis_codes?: string[] // ICD-10 codes
  treatment_notes?: string
  prescriptions?: {
    medication: string
    dosage: string
    frequency: string
    duration: string
  }[]
  attending_doctor_id?: string
  discharge_time?: string
  status: "active" | "discharged" | "transferred"
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  hospital_id: string
  name: string
  category: "medication" | "consumable" | "equipment"
  unit: string
  min_threshold: number
  max_threshold?: number
  current_stock: number
  unit_cost?: number
  supplier?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StockBatch {
  id: string
  item_id: string
  batch_number: string
  quantity: number
  unit_cost?: number
  expiry_date?: string
  received_date: string
  supplier?: string
  status: "available" | "expired" | "recalled"
  created_at: string
}

export interface StockTransaction {
  id: string
  item_id: string
  batch_id?: string
  hospital_id: string
  transaction_type: "receive" | "dispense" | "adjust" | "transfer" | "waste"
  quantity_change: number
  reference_id?: string
  reason?: string
  performed_by?: string
  created_at: string
}

export interface Referral {
  id: string
  patient_nin: string
  from_hospital_id: string
  to_hospital_id: string
  referring_doctor_id?: string
  department?: string
  urgency_level: "routine" | "urgent" | "emergency"
  reason: string
  clinical_summary?: string
  status: "pending" | "accepted" | "rejected" | "completed"
  referred_at: string
  response_at?: string
  notes?: string
}

export interface AuditLog {
  id: string
  user_id?: string
  hospital_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  patient_nin?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface SyncStatus {
  id: string
  hospital_id: string
  resource_type: string
  resource_id: string
  last_synced_at?: string
  sync_status: "pending" | "synced" | "failed"
  error_message?: string
  retry_count: number
  created_at: string
  updated_at: string
}

// Extended types with relations for UI components
export interface AppointmentWithPatient extends Appointment {
  patient?: Patient
  doctor?: User
}

export interface VisitWithDetails extends Visit {
  patient?: Patient
  appointment?: Appointment
  attending_doctor?: User
}

export interface InventoryItemWithStock extends InventoryItem {
  batches?: StockBatch[]
  recent_transactions?: StockTransaction[]
}

export interface ReferralWithDetails extends Referral {
  patient?: Patient
  from_hospital?: Hospital
  to_hospital?: Hospital
  referring_doctor?: User
}
