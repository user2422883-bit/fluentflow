import { Home, Mic, TrendingUp, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Page } from "@/App"

const tabs = [
  { id: "home" as Page, label: "Home", icon: Home },
  { id: "practice" as Page, label: "Practice", icon: Mic },
  { id: "progress" as Page, label: "Progress", icon: TrendingUp },
  { id: "vocabulary" as Page, label: "Words", icon: BookOpen },
]

interface BottomNavProps {
  current: Page
  onChange: (page: Page) => void
}

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
              current === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div
              className={cn(
                "flex size-6 items-center justify-center rounded-md transition-colors",
                current === id && "text-primary"
              )}
            >
              <Icon className="size-5" />
            </div>
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}