export type VehicleHistoryAction =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'deleted'

export interface VehicleHistoryChange {
  field: string
  label: string
  from: string
  to: string
}

export interface VehicleHistoryEntry {
  id: string
  vehicleId: string
  plate: string
  action: VehicleHistoryAction
  title: string
  description: string
  changes: VehicleHistoryChange[]
  createdAt: Date
}
