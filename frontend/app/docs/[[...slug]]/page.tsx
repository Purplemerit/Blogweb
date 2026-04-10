"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight, Search, Share2 } from "lucide-react"

const quickCards = [
  { title: "Create Article", desc: "Start writing your first piece of content." },
  { title: "Connect Platforms", desc: "Link Medium, WordPress, and more." },
  { title: "Publish First", desc: "Launch your content to the world." },
  { title: "Set-up Analytics", desc: "Track performance and engagement." },
]

const helpfulArticles = [
  { category: "INTEGRATION", title: "Connecting Custom Domains via DNS", desc: "Learn how to properly configure CNAME records for your custom domain." },
  { category: "BILLING", title: "Managing Subscription Tiers", desc: "How to upgrade, downgrade, or pause your team subscription plan." },
  { category: "PUBLISHING", title: "Scheduling Post for Social Media", desc: "Automate your distribution calendar with our scheduling tools." },
  { category: "TROUBLESHOOTING", title: "Fixing Image upload Errors", desc: "Common reasons why uploads fail and how to resolve them." },
]

const categories = [
  "Getting Started",
  "Writing & Editing",
  "Publishing",
  "Analytics & Reports",
  "Integrations",
  "Billing & Plans",
  "Account & Settings",
  "Troubleshooting",
  "API & Webhooks",
]

export default function DocsPage() {
  const params = useParams()
  const slug = params.slug as string[] | undefined

  if (slug && slug.length > 0) {
    const pageTitle = slug[slug.length - 1].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    return (
      <div className="bg-[#fffefd] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <Link href="/docs" className="text-sm font-bold text-[#fb6503]">Back to Documentation</Link>
          <h1 className="mt-4 text-4xl font-bold text-[#171717]">{pageTitle}</h1>
          <p className="mt-4 text-[#4d4d4d]">Detailed documentation page for {pageTitle}.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#fffefd] text-[#171717]">
      <section className="bg-[linear-gradient(rgba(255,254,253,0.9),rgba(255,254,253,0.9)),url('/design/BG%2023-01%202.png')] bg-cover bg-center px-4 pb-14 pt-20 md:px-8 md:pt-24">
        <div className="mx-auto max-w-[1260px] text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            How Can We Help You <span className="font-medium italic text-[#6a6a6a]">Today ?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[820px] text-sm font-medium text-[#4d4d4d] md:text-base">
            Find answers, manage your account, and learn how to optimize your content workflow.
          </p>

          <div className="mx-auto mt-8 flex max-w-[720px] items-center gap-2 rounded-full border border-[#e45c03] px-5 py-3 shadow-[0_2px_2px_0_#fecfb1]">
            <Search className="h-4 w-4 text-[#fb6503]" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search Documentation" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-[#e9e9e9]" />
            <p className="text-3xl font-medium">Get Started</p>
            <div className="h-px flex-1 bg-[#e9e9e9]" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-[#e9e9e9] bg-[#fffefd] p-5">
                <div className="inline-flex rounded-full bg-[#fff7ed] p-1.5">
                  <div className="rounded-full bg-[#fff0e6] p-2 text-[#fb6503]"><Share2 className="h-4 w-4" /></div>
                </div>
                <h3 className="mt-4 text-xl font-bold">{card.title}</h3>
                <p className="mt-2 text-sm text-[#4d4d4d]">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf3] px-4 py-12 md:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Most Helpful Articles</h2>
            <p className="mt-2 text-sm text-[#4d4d4d]">Quickly discover content ideas across popular categories.</p>
          </div>

          <div className="mt-8 divide-y divide-[#e9e9e9] rounded-2xl border border-[#e9e9e9] bg-white">
            {helpfulArticles.map((item) => (
              <div key={item.title} className="flex items-center justify-between gap-4 px-5 py-5">
                <div>
                  <p className="text-xs font-bold text-[#4d4d4d]">{item.category}</p>
                  <p className="mt-1 text-xl font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-[#4d4d4d]">{item.desc}</p>
                </div>
                <button className="rounded-full p-1 text-[#fb6503]"><ArrowRight className="h-5 w-5" /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Browse by Category</h2>
            <p className="mt-2 text-sm text-[#4d4d4d]">Quickly discover content ideas across popular categories.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((name) => (
              <article key={name} className="rounded-2xl border border-[#e9e9e9] bg-[#fffbf7] p-5">
                <div className="flex items-center justify-between text-sm">
                  <div className="inline-flex rounded-full bg-[#fff7ed] p-1.5">
                    <div className="rounded-full bg-[#fff0e6] p-1.5 text-[#fb6503]"><Share2 className="h-3.5 w-3.5" /></div>
                  </div>
                  <p className="font-bold text-[#212121]">12 Articles</p>
                </div>
                <h3 className="mt-4 text-2xl font-bold">{name}</h3>
                <p className="mt-2 text-sm text-[#4d4d4d]">Browse articles related to {name.toLowerCase()}.</p>
                <button className="mt-6 inline-flex items-center gap-2 text-sm underline">Browse articles <ArrowRight className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 text-center md:px-8">
        <h3 className="text-4xl font-bold">Ready to elevate your content ?</h3>
        <p className="mt-2 text-sm text-[#4d4d4d]">Join thousands of creators and brands automating their growth today.</p>
        <button className="mt-5 rounded-full bg-[#fb6503] px-10 py-3 text-sm font-bold text-white">GET STARTED NOW</button>
        <p className="mt-2 text-xs text-[#999]">No credit required for free plan</p>
      </section>
    </div>
  )
}
