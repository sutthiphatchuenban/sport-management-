import { prisma } from '@/lib/prisma'
import { Trophy, Medal, Star, Calendar, Users, Vote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const revalidate = 10 // Revalidate every 10 seconds

export default async function Home() {
  const colors = await prisma.color.findMany({
    orderBy: { totalScore: 'desc' },
  })

  const recentResults = await prisma.eventResult.findMany({
    take: 5,
    orderBy: { recordedAt: 'desc' },
    include: {
      event: {
        include: { sportType: true }
      },
      color: true,
      athlete: true,
    }
  })

  const ongoingEvents = await prisma.event.count({
    where: { status: 'ONGOING' }
  })

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary)_0%,transparent_100%)] opacity-10" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary animate-pulse-slow">
              <Trophy className="mr-2 h-4 w-4" />
              IT Sport 2024 - การแข่งขันเริ่มขึ้นแล้ว!
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              พลังแห่ง <span className="text-gradient">ความสามัคคี</span> <br />
              สู่ชัยชนะที่ยิ่งใหญ่
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              ร่วมเชียร์และโหวตนักกีฬาที่คุณชื่นชอบ พร้อมติดตามผลการแข่งขันแบบเรียลไทม์
              พัฒนาโดยสโมสรนิสิตคณะวิทยาการสารสนเทศ
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 py-4">
              <Button asChild size="lg" className="rounded-full px-8 shadow-glow">
                <Link href="/leaderboard">
                  ดูคะแนนรวม
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 glass">
                <Link href="/vote">
                  ไปโหวตนักกีฬา
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          {[
            { label: 'กำลังแข่งขัน', value: ongoingEvents, icon: Trophy, color: 'text-primary' },
            { label: 'นิสิตที่ร่วมงาน', value: '1,200+', icon: Users, color: 'text-blue-500' },
            { label: 'โหวตทั้งหมด', value: '450+', icon: Vote, color: 'text-pink-500' },
            { label: 'วันแข่งขัน', value: '2 วัน', icon: Calendar, color: 'text-green-500' },
          ].map((stat, i) => (
            <Card key={i} className="glass overflow-hidden border-none card-gradient">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn("rounded-full bg-background/50 p-2", stat.color)}>
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="text-xl font-bold md:text-2xl">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <div className="grid gap-1">
              <h2 className="text-3xl font-bold tracking-tight">อันดับคะแนนรวม</h2>
              <p className="text-muted-foreground">สรุปคะแนนจากทุกรายการแข่งขัน</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/leaderboard">ดูทั้งหมด &rarr;</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {colors.map((color, index) => (
              <Card key={color.id} className={cn(
                "relative overflow-hidden border-none transition-all hover:scale-105",
                index === 0 ? "ring-2 ring-yellow-500" : "glass"
              )}>
                <div
                  className="absolute top-0 left-0 h-2 w-full"
                  style={{ backgroundColor: color.hexCode }}
                />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">สี{color.name}</CardTitle>
                  {index === 0 && <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
                  {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                  {index === 2 && <Medal className="h-5 w-5 text-amber-600" />}
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black">{color.totalScore}</div>
                  <p className="text-xs text-muted-foreground pt-1">คะแนนสะสม</p>

                  {/* Rank Badge */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color.hexCode }} />
                      <span className="text-xs font-medium">Rank {index + 1}</span>
                    </div>
                    <div className="text-2xl font-bold opacity-10">#{index + 1}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Results & Top Athlets */}
      <section className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:py-24 lg:gap-12">
        {/* Recent Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">ผลการแข่งขันล่าสุด</h2>
            <Button variant="link" asChild>
              <Link href="/results">ดูรายการทั้งหมด</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentResults.length > 0 ? (
              recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-1 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: result.color.hexCode }}
                    />
                    <div>
                      <p className="font-semibold">{result.event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.athlete ? `${result.athlete.firstName} ${result.athlete.lastName}` : `ทีมสี${result.color.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">อันดับ {result.rank}</div>
                    <div className="text-xs font-medium text-primary">+{result.points} แต้ม</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-32 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                ยังไม่มีผลการแข่งขันที่ประกาศ
              </div>
            )}
          </div>
        </div>

        {/* Voting Spotlight */}
        <Card className="flex flex-col justify-center overflow-hidden border-none bg-gradient-to-br from-primary/20 via-primary/5 to-background p-2">
          <CardContent className="grid gap-6 p-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Vote className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">โหวตนักกีฬายอดเยี่ยม (MVP)</h2>
              <p className="text-muted-foreground">
                คุณมี 1 สิทธิ์ในการโหวตนักกีฬาที่คุณประทับใจมากที่สุด
                ร่วมเป็นส่วนหนึ่งในการมอบรางวัลขวัญใจมหาชน
              </p>
            </div>
            <div className="space-y-4">
              <Button className="w-full rounded-xl py-6 text-lg font-semibold shadow-glow" size="lg" asChild>
                <Link href="/vote">เข้าสู่ระบบเพื่อโหวต</Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                สิ้นสุดการโหวตวันที่ 24 ธันวาคม 2567 เวลา 18:00 น.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
