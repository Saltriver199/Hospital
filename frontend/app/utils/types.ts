// utils/types.ts

export type UUID = string

export interface User {
  id: UUID
  username: string
  email: string
  role: 'admin' | 'supervisor' | 'nurse'
  // plus any other fields your UserSerializer returns…
}

export interface Hospital {
  id: UUID
  name: string
  address: string
  admin: UUID | null
}

export interface Building {
  id: UUID
  name: string
  hospital: UUID
  building_manager: UUID | null
}

export interface Floor {
  id: UUID
  number: number
  building: UUID
  floor_manager: UUID | null
}

export interface Ward {
  id: UUID
  name: string
  floor: UUID
}

export interface Bed {
  id: UUID
  number: string
  ward: UUID
  nurses: UUID[]      // array of Nurse IDs
}

export interface Device {
  id: UUID
  serial_number: string
  bed: UUID
}

export interface StaffTeam {
  id: UUID
  name: string
}

export interface Nurse {
  id: UUID
  team: UUID
  nurse_id: string
  name: string
}

export interface TeamAssignment {
  id: UUID
  ward: UUID
  floor: UUID
  team: UUID
}

export interface Call {
  id: UUID
  device: UUID
  bed: UUID
  call_time: string   // ISO datetime
  status: string
  response_time: string | null
  nurse: UUID | null
}

export interface Patient {
  id: UUID
  name: string
  age: number
  gender: string
  bed: UUID | null
}
