import type { components } from '#build/types/open-fetch/schemas/api'

export type UserViewModel = components['schemas']['UserViewModel']
export type DeviceViewModel = components['schemas']['DeviceViewModel']
export type SchoolClassViewModel = components['schemas']['SchoolClassViewModel']

export type TeacherRef = components['schemas']['TeacherRef']
export type StudentRef = components['schemas']['StudentRef']

export type DeviceMode = DeviceViewModel['mode']
