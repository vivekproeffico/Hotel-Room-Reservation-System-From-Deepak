import type { Room } from "@/lib/types"

interface BookingInfoProps {
  rooms: Room[]
  travelTime: number
}

export function BookingInfo({ rooms, travelTime }: BookingInfoProps) {
  // Group rooms by floor for better organization
  const roomsByFloor = rooms.reduce(
    (acc, room) => {
      if (!acc[room.floor]) {
        acc[room.floor] = []
      }
      acc[room.floor].push(room.number)
      return acc
    },
    {} as Record<number, number[]>,
  )

  // Calculate some useful statistics
  const totalRooms = rooms.length
  const floorCount = Object.keys(roomsByFloor).length
  const isSingleFloor = floorCount === 1

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium tracking-tight text-card-foreground">Booking Summary</h2>
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {totalRooms} {totalRooms === 1 ? "Room" : "Rooms"}
        </span>
      </div>

      <div className="space-y-4">
        {/* Room Details grouped by floor */}
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">Booked Rooms</p>
          <div className="space-y-2">
            {Object.entries(roomsByFloor)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([floor, roomNumbers]) => (
                <div key={floor} className="rounded-md bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Floor {floor}</span>
                    <span className="text-xs text-muted-foreground">
                      {roomNumbers.length} {roomNumbers.length === 1 ? "room" : "rooms"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{roomNumbers.sort((a, b) => a - b).join(", ")}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Travel Time with visual indicator */}
        <div className="border-t border-border pt-4">
          <p className="mb-2 text-sm font-medium text-muted-foreground">Total Travel Time</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-foreground">{travelTime}</p>
            <span className="text-base text-muted-foreground">minutes</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {isSingleFloor ? "All rooms on same floor - optimal booking!" : "Travel time from first to last room"}
          </p>
        </div>

        <div className="rounded-md bg-success/10 p-3 border border-success/20">
          <div className="flex items-start gap-2">
            <svg
              className="h-5 w-5 text-success flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-success">Optimized Booking</p>
              <p className="mt-0.5 text-xs text-success/80">Rooms selected to minimize travel time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
