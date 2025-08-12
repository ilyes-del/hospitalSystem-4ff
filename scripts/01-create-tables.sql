-- National Hospital Management System Database Schema
-- Algeria Healthcare System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hospitals table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    region VARCHAR(100),
    type VARCHAR(50), -- public, private, specialized
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with role-based access
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- admin, doctor, nurse, pharmacist, receptionist
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table with NIN as primary identifier
CREATE TABLE patients (
    nin VARCHAR(18) PRIMARY KEY, -- National Identity Number (Algeria format)
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    contact_hash VARCHAR(255), -- Hashed contact info for privacy
    phone_encrypted TEXT, -- Encrypted phone number
    address_encrypted TEXT, -- Encrypted address
    primary_hospital_id UUID REFERENCES hospitals(id),
    consent_flags JSONB DEFAULT '{}', -- Consent for data sharing
    emergency_contact_encrypted TEXT,
    blood_type VARCHAR(5),
    allergies TEXT[],
    chronic_conditions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments (RDV) table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_nin VARCHAR(18) REFERENCES patients(nin),
    hospital_id UUID REFERENCES hospitals(id),
    doctor_id UUID REFERENCES users(id),
    department VARCHAR(100) NOT NULL,
    appointment_type VARCHAR(50), -- consultation, follow-up, emergency
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, confirmed, in-progress, completed, cancelled, no-show
    priority_level INTEGER DEFAULT 1, -- 1=routine, 2=urgent, 3=emergency
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visits table for actual patient visits
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_nin VARCHAR(18) REFERENCES patients(nin),
    hospital_id UUID REFERENCES hospitals(id),
    appointment_id UUID REFERENCES appointments(id),
    department VARCHAR(100) NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    triage_level INTEGER, -- 1=non-urgent, 2=urgent, 3=very urgent, 4=emergency
    chief_complaint TEXT,
    vital_signs JSONB,
    diagnosis_codes TEXT[], -- ICD-10 codes
    treatment_notes TEXT,
    prescriptions JSONB,
    attending_doctor_id UUID REFERENCES users(id),
    discharge_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- active, discharged, transferred
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory items table
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- medication, consumable, equipment
    unit VARCHAR(50), -- pieces, boxes, vials, etc.
    min_threshold INTEGER DEFAULT 0,
    max_threshold INTEGER,
    current_stock INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2),
    supplier VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock batches for lot tracking
CREATE TABLE stock_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory_items(id),
    batch_number VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    expiry_date DATE,
    received_date DATE DEFAULT CURRENT_DATE,
    supplier VARCHAR(255),
    status VARCHAR(20) DEFAULT 'available', -- available, expired, recalled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock transactions for audit trail
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory_items(id),
    batch_id UUID REFERENCES stock_batches(id),
    hospital_id UUID REFERENCES hospitals(id),
    transaction_type VARCHAR(50) NOT NULL, -- receive, dispense, adjust, transfer, waste
    quantity_change INTEGER NOT NULL, -- positive for incoming, negative for outgoing
    reference_id UUID, -- visit_id, appointment_id, or other reference
    reason TEXT,
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals between hospitals
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_nin VARCHAR(18) REFERENCES patients(nin),
    from_hospital_id UUID REFERENCES hospitals(id),
    to_hospital_id UUID REFERENCES hospitals(id),
    referring_doctor_id UUID REFERENCES users(id),
    department VARCHAR(100),
    urgency_level VARCHAR(20), -- routine, urgent, emergency
    reason TEXT NOT NULL,
    clinical_summary TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, completed
    referred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Audit logs for compliance and security
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    hospital_id UUID REFERENCES hospitals(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- patient, appointment, inventory, etc.
    resource_id VARCHAR(255),
    patient_nin VARCHAR(18), -- For patient-related actions
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync status for national database synchronization
CREATE TABLE sync_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id),
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(20) DEFAULT 'pending', -- pending, synced, failed
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_patients_hospital ON patients(primary_hospital_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_nin);
CREATE INDEX idx_appointments_hospital_date ON appointments(hospital_id, scheduled_at);
CREATE INDEX idx_visits_patient ON visits(patient_nin);
CREATE INDEX idx_visits_hospital_date ON visits(hospital_id, arrival_time);
CREATE INDEX idx_inventory_hospital ON inventory_items(hospital_id);
CREATE INDEX idx_stock_transactions_item ON stock_transactions(item_id);
CREATE INDEX idx_audit_logs_user_date ON audit_logs(user_id, created_at);
CREATE INDEX idx_sync_status_hospital_type ON sync_status(hospital_id, resource_type);
