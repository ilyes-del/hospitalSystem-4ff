// Constants for the National Hospital Management System

export const APPOINTMENT_STATUSES = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no-show",
} as const

export const APPOINTMENT_TYPES = {
  CONSULTATION: "consultation",
  FOLLOW_UP: "follow-up",
  EMERGENCY: "emergency",
} as const

export const PRIORITY_LEVELS = {
  ROUTINE: 1,
  URGENT: 2,
  EMERGENCY: 3,
} as const

export const TRIAGE_LEVELS = {
  NON_URGENT: 1,
  URGENT: 2,
  VERY_URGENT: 3,
  EMERGENCY: 4,
} as const

export const USER_ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  PHARMACIST: "pharmacist",
  RECEPTIONIST: "receptionist",
} as const

export const HOSPITAL_TYPES = {
  PUBLIC: "public",
  PRIVATE: "private",
  MILITARY: "military",
  SPECIALIZED: "specialized",
} as const

export const INVENTORY_CATEGORIES = {
  MEDICATION: "medication",
  CONSUMABLE: "consumable",
  EQUIPMENT: "equipment",
} as const

export const TRANSACTION_TYPES = {
  RECEIVE: "receive",
  DISPENSE: "dispense",
  ADJUST: "adjust",
  TRANSFER: "transfer",
  WASTE: "waste",
} as const

export const VISIT_STATUSES = {
  ACTIVE: "active",
  DISCHARGED: "discharged",
  TRANSFERRED: "transferred",
} as const

export const REFERRAL_STATUSES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  COMPLETED: "completed",
} as const

export const URGENCY_LEVELS = {
  ROUTINE: "routine",
  URGENT: "urgent",
  EMERGENCY: "emergency",
} as const

export const SYNC_STATUSES = {
  PENDING: "pending",
  SYNCED: "synced",
  FAILED: "failed",
} as const

// Algerian regions for hospital classification
export const ALGERIAN_REGIONS = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
] as const

// Common medical departments
export const MEDICAL_DEPARTMENTS = [
  "Urgences",
  "Cardiologie",
  "Neurologie",
  "Orthopédie",
  "Pédiatrie",
  "Gynécologie",
  "Dermatologie",
  "Ophtalmologie",
  "ORL",
  "Psychiatrie",
  "Radiologie",
  "Laboratoire",
  "Pharmacie",
  "Chirurgie Générale",
  "Médecine Interne",
  "Pneumologie",
  "Gastroentérologie",
  "Urologie",
  "Anesthésie",
  "Réanimation",
] as const

// NIN validation pattern for Algeria (18 digits)
export const NIN_PATTERN = /^\d{18}$/

// Privacy and consent flags
export const CONSENT_TYPES = {
  DATA_SHARING: "data_sharing",
  CROSS_HOSPITAL_ACCESS: "cross_hospital_access",
  RESEARCH_PARTICIPATION: "research_participation",
  EMERGENCY_CONTACT: "emergency_contact",
  MARKETING_COMMUNICATIONS: "marketing_communications",
} as const
