import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import '@/styles/globals.css'

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-semibold">Enterprise OS</h1>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold gradient-text">
                Modern Frontend Architecture
              </h1>
              <p className="text-xl text-muted-foreground">
                Un SaaS CRM/ERP stable, performant et moderne
              </p>
            </div>

            {/* Demo Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Design System Demo</h2>
              
              {/* Buttons Demo */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Button Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* Loading States */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Loading States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button isLoading>Loading</Button>
                  <Button isLoading loadingText="Saving...">Save</Button>
                  <Button variant="success" isLoading>Success</Button>
                </div>
              </div>

              {/* Status Card */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2">Project Status</h3>
                <p className="text-muted-foreground mb-4">
                  Phase 1: Foundation & Setup ✅
                </p>
                <p className="text-muted-foreground">
                  Phase 2: Design System Core 🚧 (In Progress)
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)