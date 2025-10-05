"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BookingControlsProps {
  onBook: (count: number) => void
  onGenerateRandom: () => void
  onReset: () => void
  availableRoomCount: number
}

export function BookingControls({ onBook, onGenerateRandom, onReset, availableRoomCount }: BookingControlsProps) {
  const [roomCount, setRoomCount] = useState<string>("1")
  const [error, setError] = useState<string>("")
  const [isShaking, setIsShaking] = useState(false)

  const validateInput = (value: string): string => {
    // Check if input is empty
    if (!value.trim()) {
      return "Please enter number of rooms"
    }

    const count = Number.parseInt(value)

    // Check if it's a valid number
    if (isNaN(count)) {
      return "Please enter a valid number"
    }

    // Check minimum constraint
    if (count < 1) {
      return "Minimum 1 room required"
    }

    // Check maximum constraint
    if (count > 5) {
      return "Maximum 5 rooms allowed per booking"
    }

    // Check if enough rooms are available
    if (count > availableRoomCount) {
      return `Only ${availableRoomCount} rooms available`
    }

    return ""
  }

  const handleInputChange = (value: string) => {
    setRoomCount(value)

    // Clear error when user starts typing
    if (error) {
      setError("")
    }
  }

  const handleBook = () => {
    const validationError = validateInput(roomCount)

    if (validationError) {
      setError(validationError)
      // Trigger shake animation for visual feedback
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 300)
      return
    }

    // All validation passed, proceed with booking
    const count = Number.parseInt(roomCount)
    onBook(count)

    // Reset form after successful booking
    setRoomCount("1")
    setError("")
  }

  // Allow booking with Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBook()
    }
  }

  const isBookingDisabled = !roomCount.trim() || availableRoomCount === 0

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-medium tracking-tight text-card-foreground">Booking Controls</h2>

      <div className="space-y-6">
        {/* Room Count Input with Validation */}
        <div className="space-y-2">
          <Label htmlFor="room-count" className="text-sm font-medium text-foreground">
            Number of rooms
          </Label>
          <p className="text-xs text-muted-foreground">Enter between 1-5 rooms ({availableRoomCount} available)</p>

          <div className={`flex gap-2 ${isShaking ? "animate-shake" : ""}`}>
            <div className="flex-1">
              <Input
                id="room-count"
                type="number"
                min="1"
                max="5"
                value={roomCount}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`${error ? "border-destructive focus:border-destructive" : ""}`}
                placeholder="Enter 1-5"
                aria-invalid={!!error}
                aria-describedby={error ? "room-count-error" : undefined}
              />

              {/* Error message */}
              {error && (
                <p id="room-count-error" className="mt-1.5 text-xs text-destructive animate-slide-in" role="alert">
                  {error}
                </p>
              )}
            </div>

            <Button onClick={handleBook} className="px-6 bg-primary hover:bg-primary/90" disabled={isBookingDisabled}>
              Book
            </Button>
          </div>

          {/* Helpful hint */}
          {availableRoomCount === 0 && (
            <p className="text-xs text-muted-foreground italic animate-slide-in">
              No rooms available. Try generating random occupancy or resetting.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 border-t border-border pt-6">
          <Button onClick={onGenerateRandom} variant="outline" className="w-full hover:bg-muted bg-transparent">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Generate Random Occupancy
          </Button>

          <Button onClick={onReset} variant="outline" className="w-full hover:bg-muted bg-transparent">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset All Bookings
          </Button>
        </div>
      </div>
    </div>
  )
}
