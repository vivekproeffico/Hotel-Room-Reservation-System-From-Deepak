"use client"

import { useState } from "react"
import { HotelLayout } from "@/components/hotel-layout"
import { BookingControls } from "@/components/booking-controls"
import { BookingInfo } from "@/components/booking-info"
import { generateHotelRooms, findOptimalRooms, calculateTravelTime } from "@/lib/booking-algorithm"
import type { Room } from "@/lib/types"

export default function HotelReservationSystem() {
  const [rooms, setRooms] = useState<Room[]>(generateHotelRooms())
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const [travelTime, setTravelTime] = useState<number>(0)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const availableRoomCount = rooms.filter((room) => room.status === "available").length

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleBookRooms = (count: number) => {
    const availableRooms = rooms.filter((room) => room.status === "available")

    if (availableRooms.length < count) {
      showNotification("error", `Only ${availableRooms.length} rooms available`)
      return
    }

    try {
      const optimalRooms = findOptimalRooms(availableRooms, count)

      const time = calculateTravelTime(optimalRooms)
      setTravelTime(time)

      const updatedRooms = rooms.map((room) => {
        const isBooked = optimalRooms.find((r) => r.number === room.number)
        if (isBooked) {
          return { ...room, status: "booked" as const }
        }
        return room
      })

      setRooms(updatedRooms)
      setSelectedRooms(optimalRooms)

      showNotification("success", `Successfully booked ${count} room${count > 1 ? "s" : ""}!`)
    } catch (error) {
      showNotification("error", "Failed to book rooms. Please try again.")
    }
  }

  const handleGenerateRandomOccupancy = () => {
    const updatedRooms = rooms.map((room) => {
      if (room.status === "booked") {
        return { ...room, status: "available" as const }
      }

      const shouldOccupy = Math.random() < 0.4
      return {
        ...room,
        status: shouldOccupy ? ("occupied" as const) : room.status,
      }
    })

    setRooms(updatedRooms)
    setSelectedRooms([])
    setTravelTime(0)
    showNotification("success", "Random occupancy generated")
  }

  const handleReset = () => {
    setRooms(generateHotelRooms())
    setSelectedRooms([])
    setTravelTime(0)
    showNotification("success", "All bookings reset")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Hotel Room Reservation System
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Intelligent room allocation with optimized travel time calculation
          </p>
        </header>

        {notification && (
          <div
            className={`mb-6 rounded-lg border p-4 animate-slide-in ${
              notification.type === "success"
                ? "border-success bg-success/10 text-success"
                : "border-destructive bg-destructive/10 text-destructive"
            }`}
            role="alert"
          >
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <BookingControls
              onBook={handleBookRooms}
              onGenerateRandom={handleGenerateRandomOccupancy}
              onReset={handleReset}
              availableRoomCount={availableRoomCount}
            />

            {selectedRooms.length > 0 && (
              <div className="animate-slide-in">
                <BookingInfo rooms={selectedRooms} travelTime={travelTime} />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <HotelLayout rooms={rooms} selectedRooms={selectedRooms} />
          </div>
        </div>
      </div>
    </div>
  )
}
