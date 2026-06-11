// Components
export { default as VehicleManagement } from './components/vehicleManagement'
export { default as CreateVehicleButton } from './components/createButton'
export { default as UpdateVehicleButton } from './components/updateButton'
export { default as DeleteVehicleButton } from './components/deleteButton'
export { default as ExportVehiclesButton } from './components/exportButton'
export { Header } from './components/header'

// Services
export {
  getVehicles,
  getVehicleById,
  getVehicleHistory,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  bulkUpdateVehicleStatus,
  bulkDeleteVehicles,
  getVehiclesList,
  exportVehicles,
  exportSelectedVehicles,
} from './services/vehicleService'

// Hooks
export { useVehicleColumns } from './hooks/useVehicleColumns'
export { useVehicleFormOptions } from './hooks/useVehicleFormOptions'

// Types
export type { Vehicle } from './types/Vehicle/base-vehicle.dto'
export type { CreateVehicleDto } from './types/Vehicle/create-vehicle.dto'
export type { UpdateVehicleDto } from './types/Vehicle/update-vehicle.dto'
export type { QueryVehicleDto } from './types/Vehicle/query-vehicle.dto'
export type {
  VehicleHistoryAction,
  VehicleHistoryChange,
  VehicleHistoryEntry,
} from './types/Vehicle/vehicle-history.dto'

// Enums
export { VehicleType } from './enums/vehicle-type.enum'

// Mocks de apoio
export {
  mockVehicles,
  mockVehiclesList,
  mockVehiclesPaginatedResponse,
} from './mocks/vehicle.mocks'
export {
  exampleCreateVehiclePayload,
  exampleUpdateVehiclePayload,
  exampleQueryVehicle,
  apiResponseShapeReference,
} from './mocks/api-examples'
