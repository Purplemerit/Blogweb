import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle2, XCircle, Settings } from "lucide-react"

export default function PlatformsPage() {
  const platforms = [
    {
      name: "WordPress",
      description: "Popular blogging platform",
      connected: true,
      siteUrl: "myblog.com",
      lastSync: "2 hours ago",
      publishedCount: 24,
    },
    {
      name: "Medium",
      description: "Professional publishing platform",
      connected: true,
      siteUrl: "medium.com/@username",
      lastSync: "5 hours ago",
      publishedCount: 18,
    },
    {
      name: "Dev.to",
      description: "Developer community",
      connected: true,
      siteUrl: "dev.to/username",
      lastSync: "1 day ago",
      publishedCount: 12,
    },
    {
      name: "Hashnode",
      description: "Blogging for developers",
      connected: false,
      siteUrl: null,
      lastSync: null,
      publishedCount: 0,
    },
    {
      name: "LinkedIn",
      description: "Professional network",
      connected: false,
      siteUrl: null,
      lastSync: null,
      publishedCount: 0,
    },
    {
      name: "Ghost",
      description: "Independent publishing",
      connected: false,
      siteUrl: null,
      lastSync: null,
      publishedCount: 0,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Publishing Platforms</h1>
        <p className="text-neutral-600 mt-1">Connect and manage your publishing destinations</p>
      </div>

      {/* Connected Platforms */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Connected Platforms</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms
            .filter((p) => p.connected)
            .map((platform) => (
              <Card key={platform.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {platform.name}
                        <Badge variant="success" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-neutral-600">Site URL</p>
                      <p className="font-medium text-sm">{platform.siteUrl}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Published Articles</p>
                      <p className="font-medium text-sm">{platform.publishedCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Last Sync</p>
                      <p className="font-medium text-sm">{platform.lastSync}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Available Platforms */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Platforms</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms
            .filter((p) => !p.connected)
            .map((platform) => (
              <Card key={platform.name} className="border-dashed">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {platform.name}
                      </CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Connect {platform.name}
                  </Button>
                  <p className="text-xs text-neutral-500 text-center mt-3">
                    Publish your content to {platform.name} with one click
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
