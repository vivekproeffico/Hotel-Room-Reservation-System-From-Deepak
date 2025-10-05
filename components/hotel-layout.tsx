import type { Room } from "@/lib/types"

interface HotelLayoutProps {
  rooms: Room[]
  selectedRooms: Room[]
}

export function HotelLayout({ rooms, selectedRooms }: HotelLayoutProps) {
  const floors = Array.from({ length: 10 }, (_, i) => 10 - i)

  const getRoomsByFloor = (floor: number) => {
    return rooms.filter((room) => room.floor === floor)
  }

  const getRoomStatus = (room: Room) => {
    if (room.status === "booked") {
      return "bg-selected border-selected text-white shadow-md"
    }
    if (room.status === "occupied") {
      return "bg-occupied border-occupied text-white"
    }

    return "bg-available border-border hover:border-foreground hover:shadow-sm room-card"
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium tracking-tight text-card-foreground">Hotel Layout</h2>


        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-border bg-available shadow-sm" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-occupied bg-occupied" />
            <span className="text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-selected bg-selected shadow-md" />
            <span className="text-muted-foreground">Your Booking</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {floors.map((floor) => {
          const floorRooms = getRoomsByFloor(floor)
          const roomCount = floor === 10 ? 7 : 10

          return (
            <div key={floor} className="flex items-center gap-4">
              {/* Floor number and info */}
              <div className="flex w-24 flex-col items-end">
                <span className="text-sm font-semibold text-foreground">Floor {floor}</span>
                <span className="text-xs text-muted-foreground">
                  {roomCount} {roomCount === 1 ? "room" : "rooms"}
                </span>
              </div>

              <div className="flex h-14 w-10 items-center justify-center rounded border border-border bg-muted shadow-sm">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Stairs and lift"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>

              {/* Room cards arranged left to right */}
              <div className="flex flex-1 gap-2">
                {floorRooms.map((room) => (
                  <div
                    key={room.number}
                    className={`flex h-14 flex-1 items-center justify-center rounded border ${getRoomStatus(room)}`}
                    title={`Room ${room.number} - ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}`}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="text-xs font-semibold">{room.number}</span>
                  </div>
                ))}

                {floor === 10 && Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} className="flex-1" />)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 space-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
        <p className="font-medium">Building Information:</p>
        <p>• Total capacity: 97 rooms across 10 floors</p>
        <p>• Travel time calculation: 1 minute per room (horizontal), 2 minutes per floor (vertical)</p>
        <p>• Rooms are arranged left to right from the stairs/lift</p>
      </div>
    </div>
  )
}
