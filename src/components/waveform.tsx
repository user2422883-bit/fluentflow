import { cn } from "@/lib/utils"

const BAR_HEIGHTS = [0.4, 0.7, 1.0, 0.6, 0.9, 0.5, 0.8, 0.45, 0.75, 0.55, 0.85, 0.65]
const BAR_DELAYS = [0, 0.1, 0.2, 0.15, 0.05, 0.25, 0.12, 0.22, 0.08, 0.18, 0.03, 0.28]

interface WaveformProps {
  className?: string
  barCount?: number
  isActive?: boolean
}

export function Waveform({ className, barCount = 12, isActive = true }: WaveformProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: barCount }).map((_, i) => {
        const maxH = BAR_HEIGHTS[i % BAR_HEIGHTS.length]
        const delay = BAR_DELAYS[i % BAR_DELAYS.length]
        return (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full bg-current transition-all",
              isActive ? "waveform-bar" : "opacity-40"
            )}
            style={{
              height: `${maxH * 28}px`,
              animationDelay: isActive ? `${delay}s` : undefined,
              animationDuration: `${0.6 + (i % 3) * 0.15}s`,
            }}
          />
        )
      })}
    </div>
  )
}