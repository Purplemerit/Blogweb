import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1e8]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#1f3529] mx-auto mb-4" />
        <p className="text-neutral-600 text-sm">Loading...</p>
      </div>
    </div>
  )
}
