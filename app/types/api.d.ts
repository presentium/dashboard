import type { components } from '#build/types/open-fetch/schemas/api'

export type UserViewModel = components['schemas']['UserViewModel']
export type StudentViewModel = components['schemas']['StudentViewModel']
export type DeviceViewModel = components['schemas']['DeviceViewModel']
export type SchoolClassViewModel = components['schemas']['SchoolClassViewModel']
export type PresenceViewModel = components['schemas']['PresenceViewModel']

export type TeacherRef = components['schemas']['TeacherRef']
export type StudentRef = components['schemas']['StudentRef']

export type DeviceMode = DeviceViewModel['mode']

export type Period = 'daily' | 'weekly' | 'monthly'
export interface Range {
  start: Date
  end: Date
}
