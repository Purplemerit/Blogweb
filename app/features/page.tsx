"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/AuthContext"
import { Activity, AlignCenter, BookOpen, CheckCircle2, PenLine, Share2, Users2 } from "lucide-react"

const featureRows = [
  {
    title: "Multi-Platform Publishing",
    description:
      "Publish your content simultaneously across Ghost, Substack, Medium, LinkedIn, and more. Reach your audience wherever they are with just one click.",
    bullets: ["One-click multi-platform distribution", "Automatic format optimization", "Platform-specific customization"],
    icon: Share2,
  },
  {
    title: "Customizable AI Editor",
    description:
      "Write with confidence using our intelligent editor. Get real-time suggestions, grammar corrections, and style improvements powered by advanced AI.",
    bullets: ["Smart content suggestions", "Grammar and style enhancement", "Rich formatting options"],
    icon: PenLine,
    reverse: true,
  },
  {
    title: "AI-Powered Analytics",
    description:
      "Understand your audience with deep insights. Track engagement, identify trends, and optimize your content strategy with AI-driven analytics.",
    bullets: ["Real-time performance tracking", "Audience behavior insights", "Predictive content recommendations"],
    icon: Activity,
  },
  {
    title: "SEO-Optimized",
    description:
      "Rank higher in search results with built-in SEO tools. Optimize meta tags, keywords, and content structure automatically for better visibility.",
    bullets: ["Automatic meta tag generation", "Keyword density analysis", "Readability score optimization"],
    icon: AlignCenter,
    reverse: true,
  },
  {
    title: "Collaborative Workspace",
    description:
      "Work together seamlessly with your team. Share drafts, leave comments, and collaborate in real-time on your content projects.",
    bullets: ["Real-time collaboration", "Inline comments and feedback", "Version history tracking"],
    icon: Users2,
  },
  {
    title: "Content Scheduling",
    description:
      "Plan your content calendar with ease. Schedule posts in advance and maintain a consistent publishing rhythm across all platforms.",
    bullets: ["Visual content calendar", "Optimal timing suggestions", "Bulk scheduling options"],
    icon: BookOpen,
    reverse: true,
  },
]

export default function FeaturesPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleStart = () => {
    router.push(user ? "/dashboard" : "/signup")
  }

  return (
    <div className="bg-[#fffefd] text-[#171717]">
      <section className="bg-[linear-gradient(rgba(255,254,253,0.9),rgba(255,254,253,0.9)),url('/design/BG%2023-01%202.png')] bg-cover bg-center px-4 pb-16 pt-20 md:px-8 md:pt-24">
        <div className="mx-auto max-w-[1260px] text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Everything You Need To
            <br />
            <span className="font-medium italic text-[#6a6a6a]">Succeed</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[820px] text-sm font-medium text-[#4d4d4d] md:text-base">
            Everything you need to create, optimize, and publish high-quality blogs faster than ever.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-8">
        <div className="mx-auto max-w-[1360px] rounded-[32px] bg-gradient-to-b from-[rgba(254,207,177,0.35)] to-[rgba(255,240,230,0.06)] p-4 md:p-8">
          <div className="space-y-6">
            {featureRows.map((row) => {
              const Icon = row.icon
              return (
                <article key={row.title} className="rounded-[28px] bg-[#fff7ed] p-3 md:p-8">
                  <div className={row.reverse ? "grid items-center gap-8 lg:grid-cols-[1fr_1.08fr]" : "grid items-center gap-8 lg:grid-cols-[1.08fr_1fr]"}>
                    <div className={row.reverse ? "lg:order-2" : ""}>
                      <div className="rounded-[20px] bg-[#fff7ed] p-3">
                        <div className="h-[250px] rounded-lg bg-white md:h-[340px]" />
                      </div>
                    </div>

                    <div className={row.reverse ? "lg:order-1" : ""}>
                      <div className="mb-4 inline-flex rounded-full bg-[#fff7ed] p-1.5">
                        <div className="rounded-full bg-[#fff0e6] p-3 text-[#fb6503]"><Icon className="h-5 w-5" /></div>
                      </div>
                      <h2 className="text-2xl font-medium md:text-[31px]">{row.title}</h2>
                      <p className="mt-3 max-w-[540px] text-sm text-[#212121] md:text-base">{row.description}</p>

                      <div className="mt-6 space-y-3">
                        {row.bullets.map((bullet) => (
                          <div key={bullet} className="flex items-center gap-2 text-sm font-bold text-[#4d4d4d] md:text-base">
                            <CheckCircle2 className="h-4 w-4 text-[#fc8435]" />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 text-center md:px-8">
        <h3 className="text-4xl font-bold">Ready to elevate your content ?</h3>
        <p className="mt-2 text-sm text-[#4d4d4d]">Join thousands of creators and brands automating their growth today.</p>
        <button onClick={handleStart} className="mt-5 rounded-full bg-[#fb6503] px-10 py-3 text-sm font-bold text-white">GET STARTED NOW</button>
        <p className="mt-2 text-xs text-[#999]">No credit card required for free plan</p>
      </section>
    </div>
  )
}
