import Link from 'next/link'
import { Trophy, Facebook, Globe, Instagram, Mail } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-background/50 backdrop-blur-md">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-4 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow transition-transform group-hover:scale-105">
                                <Trophy className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-gradient">
                                {APP_NAME}
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            ระบบบริหารจัดการการแข่งขันกีฬาสีและโหวตนักกีฬายอดเยี่ยม
                            โครงการกีฬาสีสานสัมพันธ์ คณะวิทยาการสารสนเทศ
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors">
                                <Globe className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">เมนูหลัก</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/leaderboard" className="text-sm text-foreground/70 hover:text-primary transition-colors">กระดานคะแนนรวม</Link>
                            </li>
                            <li>
                                <Link href="/schedule" className="text-sm text-foreground/70 hover:text-primary transition-colors">ตารางการแข่งขัน</Link>
                            </li>
                            <li>
                                <Link href="/results" className="text-sm text-foreground/70 hover:text-primary transition-colors">ผลการแข่งขัน</Link>
                            </li>
                            <li>
                                <Link href="/athletes" className="text-sm text-foreground/70 hover:text-primary transition-colors">ทำเนียบนักกีฬา</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">ฝ่ายจัดการแข่งขัน</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/rules" className="text-sm text-foreground/70 hover:text-primary transition-colors">กฎกติกาการแข่งขัน</Link>
                            </li>
                            <li>
                                <Link href="/scoring" className="text-sm text-foreground/70 hover:text-primary transition-colors">เกณฑ์การให้คะแนน</Link>
                            </li>
                            <li>
                                <Link href="/announcements" className="text-sm text-foreground/70 hover:text-primary transition-colors">ประกาศข่าวสาร</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">ติดต่อสอบถาม</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 text-sm text-foreground/70">
                                <Mail className="mt-1 h-4 w-4 text-primary" />
                                <div>
                                    <p className="font-medium text-foreground">สโมสรนิสิตคณะวิทยาการสารสนเทศ</p>
                                    <p>ชั้น 1 อาคารเรียนรวม IT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/5 pt-8">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <p className="text-xs font-medium text-muted-foreground">
                            © 2024 {APP_NAME}. Built with Passion by IT Club Developers.
                        </p>
                        <div className="flex space-x-6 text-xs font-medium text-muted-foreground">
                            <Link href="/privacy" className="hover:text-primary transition-colors">ความเป็นส่วนตัว</Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">เงื่อนไขการใช้งาน</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
