import type { Room } from "./types"

export function generateHotelRooms(): Room[] {
  const rooms: Room[] = []

  // Floors 1-9: 10 rooms each
  for (let floor = 1; floor <= 9; floor++) {
    for (let position = 1; position <= 10; position++) {
      rooms.push({
        number: floor * 100 + position,
        floor,
        position,
        status: "available",
      })
    }
  }

  // Floor 10: 7 rooms
  for (let position = 1; position <= 7; position++) {
    rooms.push({
      number: 1000 + position,
      floor: 10,
      position,
      status: "available",
    })
  }

  return rooms
}


export function calculateTravelTimeBetweenRooms(room1: Room, room2: Room): number {
  const verticalTime = Math.abs(room1.floor - room2.floor) * 2
  const horizontalTime = room1.floor === room2.floor ? Math.abs(room1.position - room2.position) : 0

  return verticalTime + horizontalTime
}


export function calculateTravelTime(rooms: Room[]): number {
  if (rooms.length <= 1) return 0

  // Sort rooms by floor and position to find first and last
  const sortedRooms = [...rooms].sort((a, b) => {
    if (a.floor !== b.floor) return a.floor - b.floor
    return a.position - b.position
  })

  const firstRoom = sortedRooms[0]
  const lastRoom = sortedRooms[sortedRooms.length - 1]

  return calculateTravelTimeBetweenRooms(firstRoom, lastRoom)
}


function groupRoomsByFloor(rooms: Room[]): Map<number, Room[]> {
  const floorMap = new Map<number, Room[]>()

  rooms.forEach((room) => {
    if (!floorMap.has(room.floor)) {
      floorMap.set(room.floor, [])
    }
    floorMap.get(room.floor)!.push(room)
  })

  // Sort rooms on each floor by position
  floorMap.forEach((floorRooms) => {
    floorRooms.sort((a, b) => a.position - b.position)
  })

  return floorMap
}

function findBestConsecutiveRooms(floorRooms: Room[], count: number): Room[] | null {
  if (floorRooms.length < count) return null

  let bestRooms: Room[] | null = null
  let minTravelTime = Number.POSITIVE_INFINITY

  for (let i = 0; i <= floorRooms.length - count; i++) {
    const candidateRooms = floorRooms.slice(i, i + count)
    const travelTime = calculateTravelTime(candidateRooms)

    if (travelTime < minTravelTime) {
      minTravelTime = travelTime
      bestRooms = candidateRooms
    }
  }

  return bestRooms
}

function findBestMultiFloorRooms(floorMap: Map<number, Room[]>, count: number): Room[] {
  const floors = Array.from(floorMap.keys()).sort((a, b) => a - b)
  let bestRooms: Room[] = []
  let minTravelTime = Number.POSITIVE_INFINITY


  for (let startFloor = 0; startFloor < floors.length; startFloor++) {
    for (let endFloor = startFloor; endFloor < floors.length; endFloor++) {
      const selectedFloors = floors.slice(startFloor, endFloor + 1)

      // Get all available rooms from selected floors
      const availableRooms: Room[] = []
      selectedFloors.forEach((floor) => {
        availableRooms.push(...(floorMap.get(floor) || []))
      })

      if (availableRooms.length < count) continue


      const selectedRooms: Room[] = []

      for (const floor of selectedFloors) {
        const floorRooms = floorMap.get(floor) || []
        const roomsNeeded = Math.min(count - selectedRooms.length, floorRooms.length)

        // Take rooms closest to stairs (lowest position numbers)
        selectedRooms.push(...floorRooms.slice(0, roomsNeeded))

        if (selectedRooms.length >= count) break
      }

      if (selectedRooms.length === count) {
        const travelTime = calculateTravelTime(selectedRooms)

        if (travelTime < minTravelTime) {
          minTravelTime = travelTime
          bestRooms = selectedRooms
        }
      }
    }
  }

  return bestRooms
}


export function findOptimalRooms(availableRooms: Room[], count: number): Room[] {
  if (availableRooms.length < count) {
    throw new Error("Not enough available rooms")
  }

  const floorMap = groupRoomsByFloor(availableRooms)

  for (const [floor, floorRooms] of floorMap.entries()) {
    if (floorRooms.length >= count) {
      const bestRooms = findBestConsecutiveRooms(floorRooms, count)
      if (bestRooms) {
        return bestRooms
      }
    }
  }

  return findBestMultiFloorRooms(floorMap, count)
}
