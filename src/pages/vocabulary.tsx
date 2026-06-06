import { useState } from "react"
import { Volume2, CheckCircle2, ChevronLeft, ChevronRight, Coffee, Briefcase, Brain, BookOpen, Clock, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface VocabWord {
  word: string
  phonetic: string
  partOfSpeech: string
  definition: string
  example: string
  fromScenario: string
  scenarioIcon: React.FC<{ className?: string }>
  learned: boolean
}

const todaysWords: VocabWord[] = [
  {
    word: "oat milk",
    phonetic: "/oʊt mɪlk/",
    partOfSpeech: "noun phrase",
    definition: "A plant-based milk alternative made from oats, popular in coffee drinks.",
    example: "\"Can I get a medium latte with oat milk, please?\"",
    fromScenario: "Coffee Shop",
    scenarioIcon: Coffee,
    learned: false,
  },
  {
    word: "extra shot",
    phonetic: "/ˈɛkstrə ʃɒt/",
    partOfSpeech: "noun phrase",
    definition: "An additional serving of espresso added to a coffee drink.",
    example: "\"I need an extra shot — I had a long night!\"",
    fromScenario: "Coffee Shop",
    scenarioIcon: Coffee,
    learned: false,
  },
  {
    word: "responsible for",
    phonetic: "/rɪˈspɒnsɪbl fɔː/",
    partOfSpeech: "phrase",
    definition: "Having a duty or obligation to do, manage, or care for something.",
    example: "\"I am responsible for the digital marketing campaigns.\"",
    fromScenario: "Work Meeting",
    scenarioIcon: Briefcase,
    learned: false,
  },
  {
    word: "look forward to",
    phonetic: "/lʊk ˈfɔːwəd tuː/",
    partOfSpeech: "phrasal verb",
    definition: "To feel excited or pleased about something that is going to happen.",
    example: "\"We look forward to working with your team.\"",
    fromScenario: "Work Meeting",
    scenarioIcon: Briefcase,
    learned: false,
  },
  {
    word: "past perfect",
    phonetic: "/pɑːst ˈpɜːfɪkt/",
    partOfSpeech: "grammar term",
    definition: "A verb tense using 'had + past participle' for actions completed before another past event.",
    example: "\"Before I visited Paris, I had studied French for three months.\"",
    fromScenario: "Grammar Focus",
    scenarioIcon: Brain,
    learned: false,
  },
]

const reviewQueue = [
  { word: "grab a coffee", dueIn: "Now", strength: 20 },
  { word: "get back to you", dueIn: "2h", strength: 45 },
  { word: "catch you later", dueIn: "Tomorrow", strength: 65 },
  { word: "touch base", dueIn: "2 days", strength: 80 },
]

function WordStrengthBar({ strength }: { strength: number }) {
  const color = strength >= 75 ? "bg-success" : strength >= 40 ? "bg-warning" : "bg-destructive"
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${strength}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{strength}%</span>
    </div>
  )
}

interface WordCardProps {
  word: VocabWord
  index: number
  total: number
  onMarkLearned: () => void
  onNext: () => void
  onPrev: () => void
  isLearned: boolean
}

function WordCard({ word, index, total, onMarkLearned, onNext, onPrev, isLearned }: WordCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Word {index + 1} of {total}</span>
        <div className="flex items-center gap-1.5">
          <word.scenarioIcon className="size-3" />
          <span>From: {word.fromScenario}</span>
        </div>
      </div>
      <Progress value={((index + 1) / total) * 100} className="h-1.5" />

      {/* Card */}
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300 gap-0 py-0 min-h-[200px]",
          flipped ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary/50",
          isLearned && "border-success"
        )}
        onClick={() => setFlipped(!flipped)}
      >
        <CardContent className="px-6 py-6 flex flex-col gap-4 h-full">
          {!flipped ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl font-bold tracking-tight">{word.word}</div>
                  <div className="text-base text-muted-foreground mt-1 font-mono">{word.phonetic}</div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">{word.partOfSpeech}</Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-fit gap-2 text-xs"
                onClick={(e) => { e.stopPropagation() }}
              >
                <Volume2 className="size-3.5" /> Hear pronunciation
              </Button>

              <div className="mt-auto text-xs text-muted-foreground text-center animate-pulse">
                Tap card to see definition
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-xl font-bold text-primary-foreground">{word.word}</div>
                <div className="text-sm text-primary-foreground/70 mt-1">{word.partOfSpeech}</div>
              </div>
              <Separator className="bg-primary-foreground/20" />
              <div>
                <div className="text-sm font-medium text-primary-foreground mb-2">Definition</div>
                <p className="text-sm text-primary-foreground/80 leading-relaxed">{word.definition}</p>
              </div>
              <div className="rounded-lg bg-primary-foreground/10 px-3 py-2.5">
                <div className="text-xs font-medium text-primary-foreground/70 mb-1">Example from your session:</div>
                <p className="text-sm italic text-primary-foreground/90">{word.example}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={index === 0}
          className="gap-1"
        >
          <ChevronLeft className="size-4" /> Prev
        </Button>

        <Button
          size="sm"
          variant={isLearned ? "secondary" : "default"}
          onClick={onMarkLearned}
          className={cn("gap-1", isLearned && "text-success border-success/30 bg-success/10")}
        >
          <CheckCircle2 className="size-4" />
          {isLearned ? "Learned!" : "Got it"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={index === total - 1}
          className="gap-1"
        >
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function VocabularyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [learnedSet, setLearnedSet] = useState<Set<number>>(new Set())
  const [view, setView] = useState<"cards" | "list">("cards")

  function markLearned() {
    setLearnedSet((prev) => {
      const next = new Set(prev)
      if (next.has(currentIndex)) {
        next.delete(currentIndex)
      } else {
        next.add(currentIndex)
      }
      return next
    })
  }

  const learnedCount = learnedSet.size
  const totalCount = todaysWords.length

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vocabulary</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Words from your recent sessions</p>
        </div>
        <div className="flex gap-1">
          <Button
            variant={view === "cards" ? "default" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setView("cards")}
          >
            <BookOpen className="size-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => setView("list")}
          >
            <span className="text-xs font-bold">≡</span>
          </Button>
        </div>
      </div>

      {/* Progress Summary */}
      <Card className="gap-3">
        <CardContent className="px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{learnedCount}</div>
              <div className="text-xs text-muted-foreground">Learned today</div>
            </div>
            <div className="flex-1">
              <Progress value={(learnedCount / totalCount) * 100} className="h-2.5" />
              <div className="text-xs text-muted-foreground mt-1.5">
                {totalCount - learnedCount} words left in today's deck
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-xs text-muted-foreground">Today's deck</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === "cards" ? (
        <WordCard
          word={todaysWords[currentIndex]}
          index={currentIndex}
          total={todaysWords.length}
          onMarkLearned={markLearned}
          onNext={() => setCurrentIndex((i) => Math.min(i + 1, todaysWords.length - 1))}
          onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          isLearned={learnedSet.has(currentIndex)}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {todaysWords.map((word, i) => (
            <Card
              key={word.word}
              className={cn(
                "gap-0 py-0 cursor-pointer hover:bg-accent/40 transition-colors",
                learnedSet.has(i) && "border-success/50 bg-success/5"
              )}
              onClick={() => { setCurrentIndex(i); setView("cards") }}
            >
              <CardContent className="px-4 py-3 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <word.scenarioIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{word.word}</span>
                    <span className="text-xs text-muted-foreground font-mono">{word.phonetic}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{word.definition}</p>
                </div>
                {learnedSet.has(i) && <CheckCircle2 className="size-4 text-success shrink-0" />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator />

      {/* Review Queue */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Clock className="size-4" /> Review Queue
          </h2>
          <Badge variant="outline" className="text-xs">
            {reviewQueue.filter(w => w.dueIn === "Now").length} due now
          </Badge>
        </div>
        <Card className="gap-0 py-0">
          {reviewQueue.map((item, i) => (
            <div key={item.word}>
              <div className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{item.word}</div>
                  <WordStrengthBar strength={item.strength} />
                </div>
                <div className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  item.dueIn === "Now"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                )}>
                  {item.dueIn}
                </div>
                {item.dueIn === "Now" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Review
                  </Button>
                )}
              </div>
              {i < reviewQueue.length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      </div>

      {/* Streak Reminder */}
      <Card className="bg-muted/30 gap-2">
        <CardContent className="px-4 py-4 flex items-center gap-3">
          <Flame className="size-5 text-warning fill-warning shrink-0" />
          <div>
            <div className="text-sm font-medium">Keep your streak alive!</div>
            <div className="text-xs text-muted-foreground">Learn {totalCount - learnedCount} more words to complete today's deck</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}