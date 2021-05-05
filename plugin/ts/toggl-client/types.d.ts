export interface workspaceDetails {
  admin: boolean
  api_token: string
  at: string
  default_currency: string
  default_hourly_rate: number
  ical_enabled: boolean
  ical_url: string
  id: number
  logo_url: string
  name: string
  only_admins_may_create_projects: boolean
  only_admins_see_billable_rates: boolean
  only_admins_see_team_dashboard: boolean
  premium: boolean
  profile: number
  projects_billable_by_default: boolean
  rounding: number
  rounding_minutes: number
}
