import {
  Hospital, Building, Floor, Ward,
  Bed, Device, StaffTeam, Nurse,
  TeamAssignment, Call, Patient, User
} from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function authHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('access_token')
    : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API error ${res.status}: ${errorText}`)
  }
  return res.json() as Promise<T>
}

// Generic fetch utility
function get<T>(endpoint: string): Promise<T> {
  return fetch(`${BASE}/${endpoint}`, {
    headers: authHeaders(),
  }).then(res => handleResponse<T>(res))
}

// ------- API Calls --------

export const fetchHospitals = (): Promise<Hospital[]> =>
  get<Hospital[]>('hospitals/')

export const fetchBuildings = (): Promise<Building[]> =>
  get<Building[]>('buildings/')

export const fetchFloors = (): Promise<Floor[]> =>
  get<Floor[]>('floors/')

export const fetchWards = (): Promise<Ward[]> =>
  get<Ward[]>('wards/')

export const fetchBeds = (): Promise<Bed[]> =>
  get<Bed[]>('beds/')

export const fetchDevices = (): Promise<Device[]> =>
  get<Device[]>('devices/')

export const fetchStaffTeams = (): Promise<StaffTeam[]> =>
  get<StaffTeam[]>('staff-teams/')

export const fetchNurses = (): Promise<Nurse[]> =>
  get<Nurse[]>('nurses/')

export const fetchTeamAssignments = (): Promise<TeamAssignment[]> =>
  get<TeamAssignment[]>('team-assignments/')

export const fetchCalls = (): Promise<Call[]> =>
  get<Call[]>('calls/')

export const fetchPatients = (): Promise<Patient[]> =>
  get<Patient[]>('patients/')

export const fetchUsers = (): Promise<User[]> =>
  get<User[]>('users/')

// Optional: get current logged-in user
export const fetchCurrentUser = (): Promise<User> =>
  get<User>('users/me/')
