import { Flame, Coffee, Briefcase, Brain, MessageSquare, ChevronRight, Trophy, Star, Zap, TrendingUp, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Page } from "@/App"

interface HomePageProps {
  onNavigate: (page: Page) => void
}

const scenarios = [
  { icon: Coffee, label: "Coffee Shop", description: "Order like a local", difficulty: "A2", color: "text-warning" },
  { icon: Briefcase, label: "Work Meeting", description: "Intro call with client", difficulty: "B1", color: "text-primary" },
  { icon: Brain, label: "Grammar Focus", description: "Past perfect practice", difficulty: "B2", color: "text-success" },
  { icon: MessageSquare, label: "Free Chat", description: "Talk about anything", difficulty: "Any", color: "text-muted-foreground" },
]

const recentSessions = [
  { scenario: "Coffee Shop", date: "Today", fluency: 82, task: 100, duration: "4 min" },
  { scenario: "Free Chat", date: "Yesterday", fluency: 74, task: 88, duration: "7 min" },
  { scenario: "Work Meeting", date: "2 days ago", fluency: 68, task: 72, duration: "5 min" },
]

function ScoreColor({ score }: { score: number }) {
  if (score >= 85) return <span className="text-success font-semibold">{score}</span>
  if (score >= 65) return <span className="text-warning font-semibold">{score}</span>
  return <span className="text-destructive font-semibold">{score}</span>
}

export function HomePage({ onNavigate }: HomePageProps) {
  const streakDays = 12
  const confidenceScore = 72
  const confidenceDelta = 12
  const weeklyGoalMinutes = 35
  const weeklyGoalTarget = 60

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good morning, Maria!</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ready to speak confidently today?</p>
        </div>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">M</AvatarFallback>
        </Avatar>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="py-3 gap-1">
          <CardContent className="px-3 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-warning">
              <Flame className="size-4 fill-current" />
              <span className="text-xl font-bold text-foreground">{streakDays}</span>
            </div>
            <span className="text-xs text-muted-foreground">Day streak</span>
          </CardContent>
        </Card>
        <Card className="py-3 gap-1">
          <CardContent className="px-3 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="size-4 text-success" />
              <span className="text-xl font-bold">{confidenceScore}%</span>
            </div>
            <span className="text-xs text-muted-foreground">Confidence</span>
          </CardContent>
        </Card>
        <Card className="py-3 gap-1">
          <CardContent className="px-3 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <BookOpen className="size-4 text-primary" />
              <span className="text-xl font-bold">48</span>
            </div>
            <span className="text-xs text-muted-foreground">Words learned</span>
          </CardContent>
        </Card>
      </div>

      {/* Today's Challenge */}
      <Card className="bg-primary text-primary-foreground border-0 shadow-md gap-3">
        <CardHeader className="pb-0 px-5 pt-5">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
              Daily Challenge
            </Badge>
            <Zap className="size-4 opacity-70" />
          </div>
          <CardTitle className="text-xl text-primary-foreground mt-2">Order Coffee Like a Local</CardTitle>
          <CardDescription className="text-primary-foreground/70 text-sm">
            Practice natural ordering phrases and small talk with a barista
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
              <Clock className="size-3.5" />
              <span>~5 min</span>
            </div>
            <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
              <Star className="size-3.5" />
              <span>Level A2</span>
            </div>
            <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
              <Zap className="size-3.5" />
              <span>+50 XP</span>
            </div>
          </div>
          <Button
            onClick={() => onNavigate("practice")}
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
          >
            Start Challenge
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Goal */}
      <Card className="gap-3">
        <CardHeader className="pb-1 px-4 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Weekly Speaking Goal</CardTitle>
            <span className="text-xs text-muted-foreground">{weeklyGoalMinutes}/{weeklyGoalTarget} min</span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <Progress value={(weeklyGoalMinutes / weeklyGoalTarget) * 100} className="h-2.5" />
          <p className="text-xs text-muted-foreground mt-2">
            {weeklyGoalTarget - weeklyGoalMinutes} minutes left to hit your weekly goal
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="size-3.5 text-success" />
            <span className="text-xs text-success font-medium">
              Confidence +{confidenceDelta}% this week
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Practice Scenarios */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Practice Scenarios</h2>
          <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => onNavigate("practice")}>
            All <ChevronRight className="size-3" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {scenarios.map(({ icon: Icon, label, description, difficulty, color }) => (
            <Card
              key={label}
              className="cursor-pointer hover:bg-accent/50 transition-colors gap-2 py-4"
              onClick={() => onNavigate("practice")}
            >
              <CardContent className="px-4">
                <Icon className={`size-6 mb-2 ${color}`} />
                <div className="font-medium text-sm leading-tight">{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
                <Badge variant="outline" className="mt-2 text-xs h-5">
                  {difficulty}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Recent Sessions</h2>
          <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => onNavigate("progress")}>
            See all <ChevronRight className="size-3" />
          </Button>
        </div>
        <Card className="gap-0 py-0">
          {recentSessions.map((session, i) => (
            <div key={session.scenario}>
              <div className="flex items-center gap-4 px-4 py-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MessageSquare className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{session.scenario}</span>
                    <span className="text-xs text-muted-foreground">{session.date}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      Fluency: <ScoreColor score={session.fluency} />
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Task: <ScoreColor score={session.task} />
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" /> {session.duration}
                    </span>
                  </div>
                </div>
              </div>
              {i < recentSessions.length - 1 && <Separator />}
            </div>
          ))}
        </Card>
      </div>

      {/* Streak Milestones */}
      <Card className="gap-3">
        <CardHeader className="pb-1 px-4 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Trophy className="size-4 text-warning" /> Streak Milestone
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl">🌿</span>
              <div>
                <div className="text-sm font-semibold">Sprout Level</div>
                <div className="text-xs text-muted-foreground">Day {streakDays} of 21</div>
              </div>
            </div>
            <div className="flex-1">
              <Progress value={(streakDays / 21) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">{21 - streakDays} days to Bloom</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}