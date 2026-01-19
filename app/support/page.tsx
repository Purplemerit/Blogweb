'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, MessageCircle, Phone, MapPin } from "lucide-react"
import { useState } from "react"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Support request:", formData)
    alert("Thank you! We'll get back to you soon.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "support@publishtype.com",
      response: "24-48 hours",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available on our platform",
      response: "During business hours",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (555) 123-4567",
      response: "Monday - Friday",
    },
    {
      icon: MapPin,
      title: "Discord Community",
      description: "Join our community server",
      response: "24/7 community support",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-lg text-neutral-600">
            We're here to help. Get support through your preferred channel.
          </p>
        </div>
      </div>

      {/* Support Channels */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {supportChannels.map((channel) => {
            const Icon = channel.icon
            return (
              <div key={channel.title} className="p-6 border border-neutral-200 rounded-lg text-center">
                <Icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">{channel.title}</h3>
                <p className="text-sm text-neutral-600 mb-2">{channel.description}</p>
                <p className="text-xs text-neutral-500">{channel.response}</p>
              </div>
            )
          })}
        </div>

        {/* Support Form */}
        <div className="max-w-2xl mx-auto">
          <div className="border border-neutral-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your issue or inquiry..."
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
