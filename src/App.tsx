import { useState } from "react"
import { HomePage } from "@/pages/home"
import { ConversationPage } from "@/pages/conversation"
import { ProgressPage } from "@/pages/progress"
import { VocabularyPage } from "@/pages/vocabulary"
import { BottomNav } from "@/components/bottom-nav"
import { ModeToggle } from "@/components/mode-toggle"

export type Page = "home" | "practice" | "progress" | "vocabulary"

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              FF
            </div>
            <span className="text-base font-semibold tracking-tight">FluentFlow</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-20">
        <div className="mx-auto max-w-lg">
          {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
          {currentPage === "practice" && <ConversationPage />}
          {currentPage === "progress" && <ProgressPage />}
          {currentPage === "vocabulary" && <VocabularyPage />}
        </div>
      </main>

      <BottomNav current={currentPage} onChange={setCurrentPage} />
    </div>
  )
}

export default App