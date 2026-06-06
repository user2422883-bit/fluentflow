import { TrendingUp, CheckCircle2, Lock, Calendar, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import type { ChartConfig } from "@/components/ui/chart"

const fluencyData = [
  { day: "Mon", fluency: 62, target: 70 },
  { day: "Tue", fluency: 68, target: 70 },
  { day: "Wed", fluency: 65, target: 70 },
  { day: "Thu", fluency: 74, target: 70 },
  { day: "Fri", fluency: 78, target: 70 },
  { day: "Sat", fluency: 82, target: 70 },
  { day: "Sun", fluency: 87, target: 70 },
]

const chartConfig = {
  fluency: { label: "Fluency Score", color: "var(--chart-2)" },
  target: { label: "Target", color: "var(--border)" },
} satisfies ChartConfig

const achievements = [
  { emoji: "🎯", label: "First Conversation", description: "Completed your first session", unlocked: true },
  { emoji: "🔥", label: "3-Day Streak", description: "Spoke 3 days in a row", unlocked: true },
  { emoji: "☕", label: "Coffee Expert", description: "Ordered in the coffee scenario", unlocked: true },
  { emoji: "💼", label: "Work Ready", description: "Complete 3 work scenarios", unlocked: false },
  { emoji: "📚", label: "Grammar Master", description: "Score 90+ on grammar 5 times", unlocked: false },
  { emoji: "🌟", label: "Fluent Speaker", description: "Reach 90% fluency score", unlocked: false },
]

const weekDays = ["M", "T", "W", "T", "F", "S", "S"]
const activityGrid = [
  [true, true, true, false, true, false, false],
  [true, true, false, true, true, true, false],
  [true, false, true, true, true, false, true],
  [true, true, true, true, true, false, false],
]

const confidenceAxes = [
  { label: "Pronunciation", score: 84, change: +8 },
  { label: "Fluency", score: 72, change: +12 },
  { label: "Grammar", score: 68, change: +5 },
  { label: "Vocabulary", score: 76, change: +9 },
  { label: "Comprehension", score: 88, change: +3 },
]

function ScoreIndicator({ score }: { score: number }) {
  const color = score >= 85 ? "bg-success" : score >= 65 ? "bg-warning" : "bg-destructive"
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-semibold w-8 text-right">{score}</span>
    </div>
  )
}

export function ProgressPage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track your journey to fluency</p>
      </div>

      {/* Overall Confidence */}
      <Card className="bg-primary text-primary-foreground border-0 gap-3">
        <CardHeader className="pb-0 px-5 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-primary-foreground">72%</CardTitle>
              <CardDescription className="text-primary-foreground/70 text-sm mt-0.5">Overall Confidence</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary-foreground/90 justify-end">
                <TrendingUp className="size-4" />
                <span className="text-sm font-semibold">+12%</span>
              </div>
              <div className="text-xs text-primary-foreground/60">this week</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <Progress value={72} className="h-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
          <div className="flex justify-between mt-2 text-xs text-primary-foreground/60">
            <span>A1 Beginner</span>
            <span>B1 Intermediate</span>
            <span>C2 Mastery</span>
          </div>
        </CardContent>
      </Card>

      {/* Streak Info */}
      <Card className="gap-3">
        <CardHeader className="pb-1 px-4 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Flame className="size-4 text-warning fill-warning" /> Speaking Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <span className="text-3xl font-bold">12</span>
              <span className="text-sm text-muted-foreground ml-1">days</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg">🌿</span>
                <span className="text-sm font-medium">Sprout Level</span>
              </div>
              <Progress value={(12 / 21) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">9 days to Bloom 🌸</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between mb-1.5">
              {weekDays.map((d, i) => (
                <span key={i} className="text-xs text-muted-foreground w-8 text-center">{d}</span>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {activityGrid.map((week, wi) => (
                <div key={wi} className="flex justify-between">
                  {week.map((active, di) => (
                    <div
                      key={di}
                      className={cn(
                        "size-7 rounded-md transition-colors",
                        active ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2 justify-end">
              <div className="size-3 rounded-sm bg-muted" />
              <span className="text-xs text-muted-foreground">No session</span>
              <div className="size-3 rounded-sm bg-primary" />
              <span className="text-xs text-muted-foreground">Practiced</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fluency Chart */}
      <Card className="gap-3">
        <CardHeader className="pb-0 px-4 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Fluency Score — This Week</CardTitle>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="size-3 mr-1" />+25 pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ChartContainer config={chartConfig} className="h-[160px] w-full">
            <AreaChart data={fluencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fluencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="fluency"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                fill="url(#fluencyGrad)"
                dot={{ fill: "var(--chart-2)", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Confidence Breakdown */}
      <Card className="gap-3">
        <CardHeader className="pb-1 px-4 pt-4">
          <CardTitle className="text-sm font-semibold">Confidence Breakdown</CardTitle>
          <CardDescription className="text-xs">Multi-axis speaking assessment</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-col gap-3">
          {confidenceAxes.map(({ label, score, change }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-[110px] shrink-0">{label}</span>
              <ScoreIndicator score={score} />
              <span className={cn("text-xs font-medium w-10 text-right", change > 0 ? "text-success" : "text-destructive")}>
                {change > 0 ? "+" : ""}{change}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Report */}
      <Card className="gap-3 bg-muted/30">
        <CardHeader className="pb-1 px-4 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="size-4" /> Weekly Report
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
              <span>You spoke <strong>12% faster</strong> in work chats this week!</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
              <span>Self-corrected grammar <strong>3 times</strong> without AI help</span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="size-4 text-primary mt-0.5 shrink-0" />
              <span>Tip: Try pausing after <em>"So…"</em> in meetings for more natural flow</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Achievements</h2>
          <span className="text-xs text-muted-foreground">3 / 6 unlocked</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map(({ emoji, label, description, unlocked }) => (
            <Card
              key={label}
              className={cn(
                "gap-2 py-3 transition-all",
                !unlocked && "opacity-50 grayscale"
              )}
            >
              <CardContent className="px-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{emoji}</span>
                  {unlocked ? (
                    <CheckCircle2 className="size-4 text-success ml-auto" />
                  ) : (
                    <Lock className="size-4 text-muted-foreground ml-auto" />
                  )}
                </div>
                <div className="text-xs font-semibold">{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}