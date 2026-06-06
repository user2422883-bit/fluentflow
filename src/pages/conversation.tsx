import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Coffee, Briefcase, Brain, MessageSquare, ChevronRight, CheckCircle2, AlertCircle, Loader2, RotateCcw, Trophy, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Waveform } from "@/components/waveform"
import { cn } from "@/lib/utils"

type RecordingState = "idle" | "recording" | "processing" | "done"
type SessionState = "select" | "chatting" | "summary"

interface Message {
  id: string
  role: "user" | "ai"
  text: string
  pronunciationScore?: number
  fluencyLabel?: string
  grammarFeedback?: { original: string; corrected: string; explanation: string }
}

interface ScenarioScript {
  id: string
  label: string
  icon: React.FC<{ className?: string }>
  difficulty: string
  description: string
  intro: string
  turns: Array<{
    aiPrompt: string
    userTranscript: string
    pronunciationScore: number
    fluencyLabel: string
    grammarFeedback?: { original: string; corrected: string; explanation: string }
    aiReply: string
  }>
  summary: { fluency: number; taskSuccess: number; topTip: string }
}

const SCENARIOS: ScenarioScript[] = [
  {
    id: "coffee",
    label: "Coffee Shop",
    icon: Coffee,
    difficulty: "A2",
    description: "Order like a local barista",
    intro: "You're at Brew & Co., a busy coffee shop. Practice ordering naturally!",
    turns: [
      {
        aiPrompt: "Good morning! Welcome to Brew & Co. What can I get started for you today?",
        userTranscript: "I want a coffee please",
        pronunciationScore: 78,
        fluencyLabel: "Good",
        grammarFeedback: { original: "I want a coffee", corrected: "I'd like a coffee", explanation: "\"I'd like\" sounds more polite and natural in service settings." },
        aiReply: "Of course! What size and any extras? We have oat milk, almond milk, or a classic with cream.",
      },
      {
        aiPrompt: "What size and any extras?",
        userTranscript: "Um... can I get a medium one with oat milk?",
        pronunciationScore: 88,
        fluencyLabel: "Excellent",
        aiReply: "Great choice! One medium latte with oat milk. That'll be $5.50. For here or to go?",
      },
      {
        aiPrompt: "For here or to go?",
        userTranscript: "To go please, thank you",
        pronunciationScore: 94,
        fluencyLabel: "Native-like",
        aiReply: "Perfect! Your latte will be ready in just a moment. Have a wonderful day!",
      },
    ],
    summary: { fluency: 87, taskSuccess: 100, topTip: "Great job! Next time try \"Could I get\" for even more natural phrasing." },
  },
  {
    id: "work",
    label: "Work Meeting",
    icon: Briefcase,
    difficulty: "B1",
    description: "Intro call with a new client",
    intro: "You're joining a video call to introduce yourself to a new client.",
    turns: [
      {
        aiPrompt: "Hi! Thanks for joining. I'm Sarah from Acme Corp. Could you introduce yourself?",
        userTranscript: "Hello, I am Maria, I work in the marketing team",
        pronunciationScore: 74,
        fluencyLabel: "Good",
        grammarFeedback: { original: "I work in the marketing team", corrected: "I work on the marketing team", explanation: "In English, we say \"on the team\" not \"in the team\"." },
        aiReply: "Great to meet you, Maria! What will you be handling on this project?",
      },
      {
        aiPrompt: "What will you be handling on this project?",
        userTranscript: "I will be responsible for the digital campaigns and social media",
        pronunciationScore: 82,
        fluencyLabel: "Good",
        aiReply: "That sounds great! We look forward to working with you. Any questions before we start?",
      },
    ],
    summary: { fluency: 78, taskSuccess: 92, topTip: "Your clarity improved each turn. Focus on \"on the team\" vs \"in the team\"." },
  },
  {
    id: "grammar",
    label: "Grammar Focus",
    icon: Brain,
    difficulty: "B2",
    description: "Past perfect in a story",
    intro: "Let's practice past perfect tense through a storytelling exercise.",
    turns: [
      {
        aiPrompt: "Tell me about a time you visited a new city. What had you done to prepare?",
        userTranscript: "Before I visited Paris, I have studied French for three months",
        pronunciationScore: 80,
        fluencyLabel: "Good",
        grammarFeedback: { original: "I have studied French", corrected: "I had studied French", explanation: "Use past perfect (had + past participle) for actions completed before another past event." },
        aiReply: "Nice story! What had you packed for the trip?",
      },
      {
        aiPrompt: "What had you packed for the trip?",
        userTranscript: "I had packed light clothes and I had downloaded offline maps",
        pronunciationScore: 91,
        fluencyLabel: "Excellent",
        aiReply: "Perfect use of past perfect! You're getting it.",
      },
    ],
    summary: { fluency: 86, taskSuccess: 85, topTip: "You mastered past perfect in the second turn — great self-correction!" },
  },
  {
    id: "free",
    label: "Free Chat",
    icon: MessageSquare,
    difficulty: "Any",
    description: "Talk about anything naturally",
    intro: "No script, no pressure! Just have a natural conversation.",
    turns: [
      {
        aiPrompt: "Hey! How's your day going so far?",
        userTranscript: "It's going well, I'm a little tired but I drank some coffee",
        pronunciationScore: 85,
        fluencyLabel: "Excellent",
        aiReply: "Ha, coffee saves the day! What are you up to today?",
      },
      {
        aiPrompt: "What are you up to today?",
        userTranscript: "I'm practicing my English, I want to be more confident when I speak",
        pronunciationScore: 90,
        fluencyLabel: "Native-like",
        aiReply: "That's awesome! Consistency is key. What topics do you want to speak about more?",
      },
    ],
    summary: { fluency: 88, taskSuccess: 96, topTip: "Your natural rhythm was great! Keep up the daily practice." },
  },
]

function ScorePill({ score }: { score: number }) {
  const color =
    score >= 85 ? "bg-success/15 text-success border-success/30" :
    score >= 65 ? "bg-warning/15 text-warning border-warning/30" :
    "bg-destructive/15 text-destructive border-destructive/30"
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold", color)}>
      {score >= 85 ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
      {score}/100
    </span>
  )
}

interface ConversationChatProps {
  scenario: ScenarioScript
  onReset: () => void
}

function ConversationChat({ scenario, onReset }: ConversationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "ai-0", role: "ai", text: scenario.turns[0].aiPrompt },
  ])
  const [turnIndex, setTurnIndex] = useState(0)
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [sessionState, setSessionState] = useState<SessionState>("chatting")
  const [isAiTyping, setIsAiTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isAiTyping])

  function handleRecord() {
    if (recordingState !== "idle") return
    setRecordingState("recording")

    setTimeout(() => {
      setRecordingState("processing")
      setTimeout(() => {
        const turn = scenario.turns[turnIndex]
        const userMsg: Message = {
          id: `user-${turnIndex}`,
          role: "user",
          text: turn.userTranscript,
          pronunciationScore: turn.pronunciationScore,
          fluencyLabel: turn.fluencyLabel,
          grammarFeedback: turn.grammarFeedback,
        }
        setMessages((prev) => [...prev, userMsg])
        setRecordingState("done")

        if (turnIndex < scenario.turns.length - 1) {
          setIsAiTyping(true)
          setTimeout(() => {
            const aiMsg: Message = {
              id: `ai-${turnIndex + 1}`,
              role: "ai",
              text: turn.aiReply,
            }
            setMessages((prev) => [...prev, aiMsg])
            setIsAiTyping(false)
            setTurnIndex((t) => t + 1)
            setRecordingState("idle")
          }, 1500)
        } else {
          setTimeout(() => {
            const aiMsg: Message = {
              id: `ai-final`,
              role: "ai",
              text: turn.aiReply,
            }
            setMessages((prev) => [...prev, aiMsg])
            setIsAiTyping(false)
            setTimeout(() => setSessionState("summary"), 1200)
          }, 1500)
        }
      }, 1000)
    }, 2500)
  }

  if (sessionState === "summary") {
    const s = scenario.summary
    return (
      <div className="flex flex-col gap-4 px-4 py-4">
        <div className="text-center pt-2">
          <div className="text-4xl mb-2">
            {s.taskSuccess >= 90 ? "🎉" : s.taskSuccess >= 70 ? "👏" : "💪"}
          </div>
          <h2 className="text-xl font-bold">Session Complete!</h2>
          <p className="text-sm text-muted-foreground mt-1">{scenario.label} — {scenario.difficulty}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="py-4 gap-2">
            <CardContent className="px-4 flex flex-col items-center gap-1">
              <div className="text-2xl font-bold text-success">{s.fluency}</div>
              <div className="text-xs font-medium">Fluency Score</div>
              <Progress value={s.fluency} className="h-1.5 w-full" />
            </CardContent>
          </Card>
          <Card className="py-4 gap-2">
            <CardContent className="px-4 flex flex-col items-center gap-1">
              <div className="text-2xl font-bold text-primary">{s.taskSuccess}%</div>
              <div className="text-xs font-medium">Task Success</div>
              <Progress value={s.taskSuccess} className="h-1.5 w-full" />
            </CardContent>
          </Card>
        </div>

        <Card className="gap-2">
          <CardHeader className="pb-0 px-4 pt-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="size-4 text-warning" /> AI Coach Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground">{s.topTip}</p>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader className="pb-0 px-4 pt-4">
            <CardTitle className="text-sm">Pronunciation Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 flex flex-col gap-2">
            {messages
              .filter((m) => m.role === "user" && m.pronunciationScore != null)
              .map((m, i) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate max-w-[200px]">Turn {i + 1}: “{m.text.slice(0, 28)}...”</span>
                  <ScorePill score={m.pronunciationScore!} />
                </div>
              ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onReset} className="gap-2">
            <RotateCcw className="size-4" /> New Scenario
          </Button>
          <Button onClick={() => {
            setMessages([{ id: "ai-0", role: "ai", text: scenario.turns[0].aiPrompt }])
            setTurnIndex(0)
            setRecordingState("idle")
            setSessionState("chatting")
            setIsAiTyping(false)
          }} className="gap-2">
            <RotateCcw className="size-4" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  const canRecord = recordingState === "idle" && !isAiTyping

  return (
    <div className="flex flex-col h-[calc(100dvh-8.5rem)]">
      {/* Scenario Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3 bg-background">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
          <scenario.icon className="size-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{scenario.label}</div>
          <div className="text-xs text-muted-foreground">{scenario.intro}</div>
        </div>
        <Badge variant="outline" className="text-xs shrink-0">{scenario.difficulty}</Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex flex-col gap-1.5", msg.role === "user" ? "items-end" : "items-start")}>
            <div
              className={cn(
                "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm",
                msg.role === "ai"
                  ? "bg-muted text-foreground rounded-tl-sm"
                  : "bg-primary text-primary-foreground rounded-tr-sm"
              )}
            >
              {msg.role === "ai" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Volume2 className="size-3 opacity-60" />
                  <span className="text-xs opacity-60 font-medium">AI Coach</span>
                </div>
              )}
              {msg.text}
            </div>

            {msg.role === "user" && msg.pronunciationScore != null && (
              <div className="flex flex-col gap-1.5 items-end max-w-[82%]">
                <div className="flex items-center gap-2">
                  <ScorePill score={msg.pronunciationScore} />
                  <span className="text-xs text-muted-foreground">
                    Fluency: <span className="font-medium text-foreground">{msg.fluencyLabel}</span>
                  </span>
                </div>
                {msg.grammarFeedback && (
                  <div className="rounded-lg border bg-warning/5 border-warning/20 px-3 py-2 text-xs w-full">
                    <div className="flex items-center gap-1 text-warning mb-1">
                      <AlertCircle className="size-3" />
                      <span className="font-semibold">Grammar Tip</span>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="line-through text-destructive/80">{msg.grammarFeedback.original}</span>
                      {" → "}
                      <span className="text-success font-medium">{msg.grammarFeedback.corrected}</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">{msg.grammarFeedback.explanation}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isAiTyping && (
          <div className="flex items-start">
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Voice Input */}
      <div className="border-t bg-background px-4 py-4">
        {recordingState === "recording" && (
          <div className="flex items-center justify-center gap-3 mb-3 text-primary">
            <Waveform isActive={true} barCount={14} />
            <span className="text-xs font-medium text-muted-foreground">Listening...</span>
          </div>
        )}
        {recordingState === "processing" && (
          <div className="flex items-center justify-center gap-2 mb-3 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-xs">Analyzing your speech...</span>
          </div>
        )}

        <div className="flex items-center gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={onReset}
          >
            End Session
          </Button>

          <button
            onClick={handleRecord}
            disabled={!canRecord}
            className={cn(
              "flex size-16 items-center justify-center rounded-full border-2 transition-all",
              canRecord
                ? "bg-primary text-primary-foreground border-primary mic-pulse-active cursor-pointer hover:scale-105"
                : recordingState === "recording"
                ? "bg-destructive text-white border-destructive scale-110"
                : "bg-muted text-muted-foreground border-border cursor-not-allowed"
            )}
          >
            {recordingState === "recording" ? (
              <MicOff className="size-6" />
            ) : recordingState === "processing" ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <Mic className="size-6" />
            )}
          </button>

          <div className="w-16 text-center">
            <span className="text-xs text-muted-foreground">
              {canRecord ? "Tap to speak" : recordingState === "recording" ? "Recording..." : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ConversationPage() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioScript | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  if (selectedScenario) {
    return <ConversationChat scenario={selectedScenario} onReset={() => setSelectedScenario(null)} />
  }

  const filteredScenarios =
    activeTab === "all"
      ? SCENARIOS
      : SCENARIOS.filter((s) =>
          activeTab === "beginner" ? s.difficulty === "A2" :
          activeTab === "intermediate" ? ["B1", "B2"].includes(s.difficulty) :
          true
        )

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Practice</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Choose a scenario to start speaking</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="beginner" className="flex-1">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate" className="flex-1">Intermediate</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="flex flex-col gap-3">
            {filteredScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors gap-0 py-0"
                onClick={() => setSelectedScenario(scenario)}
              >
                <CardContent className="px-4 py-4 flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <scenario.icon className="size-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold">{scenario.label}</span>
                      <Badge variant="outline" className="text-xs h-5">{scenario.difficulty}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 italic">{scenario.intro}</p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="rounded-xl border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Mic className="size-4" /> How it works
        </h3>
        <ol className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-primary font-bold">1.</span> Choose a scenario and tap Start</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">2.</span> Tap the mic and speak naturally</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">3.</span> Get instant pronunciation & grammar feedback</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">4.</span> See your fluency score at the end</li>
        </ol>
      </div>
    </div>
  )
}