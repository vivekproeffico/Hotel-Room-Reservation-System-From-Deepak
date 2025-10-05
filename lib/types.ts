export type RoomStatus = "available" | "occupied" | "booked"

export interface Room {
  number: number
  floor: number
  position: number // Position on floor (1-10, or 1-7 for floor 10)
  status: RoomStatus
}
