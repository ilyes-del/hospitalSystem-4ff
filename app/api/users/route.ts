import { type NextRequest, NextResponse } from "next/server"

const mockUsers = [
  {
    user_id: "1",
    username: "ilyes",
    full_name: "Ilyes Admin",
    email: "ilyes@hospital.dz",
    role: "admin",
    department: "Administration",
    hospital_id: "HCA001",
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    is_active: true,
  },
  {
    user_id: "2",
    username: "dr.benali",
    full_name: "Dr. Ahmed Benali",
    email: "benali@hospital.dz",
    role: "doctor",
    department: "Cardiologie",
    hospital_id: "HCA001",
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    is_active: true,
  },
  {
    user_id: "3",
    username: "nurse.fatima",
    full_name: "Fatima Nurse",
    email: "fatima@hospital.dz",
    role: "nurse",
    department: "Urgences",
    hospital_id: "HCA001",
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    is_active: true,
  },
]

export async function GET() {
  try {
    return NextResponse.json(mockUsers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const newUser = {
      user_id: (mockUsers.length + 1).toString(),
      ...userData,
      hospital_id: "HCA001",
      created_at: new Date().toISOString(),
      last_login: null,
      is_active: true,
    }

    mockUsers.push(newUser)

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "User created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
