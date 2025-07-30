import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Container, Grid, Stack, Divider } from '@/components/layout'
import '@/styles/globals.css'

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors">
        {/* Header */}
        <header className="border-b">
          <Container size="content" padding="md">
            <Stack direction="row" justify="between" align="center" className="h-16">
              <Typography variant="h5" weight="semibold">
                Enterprise OS
              </Typography>
              <ThemeToggle />
            </Stack>
          </Container>
        </header>

        {/* Main Content */}
        <main className="py-12">
          <Container size="narrow">
            <Stack spacing={8}>
            <div className="text-center space-y-4">
              <Typography variant="h1" className="gradient-text">
                Modern Frontend Architecture
              </Typography>
              <Typography variant="subtitle1" color="muted">
                Un SaaS CRM/ERP stable, performant et moderne
              </Typography>
            </div>

                          {/* Demo Section */}
              <section className="space-y-6">
                <Typography variant="h2">Design System Demo</Typography>
              
                              {/* Buttons Demo */}
                <div className="space-y-4">
                  <Typography variant="h3">Buttons</Typography>
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
                  <Typography variant="h3">Button Sizes</Typography>
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
                  <Typography variant="h3">Loading States</Typography>
                <div className="flex flex-wrap gap-4">
                  <Button isLoading>Loading</Button>
                  <Button isLoading loadingText="Saving...">Save</Button>
                  <Button variant="success" isLoading>Success</Button>
                </div>
                              </div>

                {/* Typography Demo */}
                <div className="space-y-4">
                  <Typography variant="h3">Typography</Typography>
                  
                  {/* Headings */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Headings</Typography>
                    <Typography variant="h1">Heading 1</Typography>
                    <Typography variant="h2">Heading 2</Typography>
                    <Typography variant="h3">Heading 3</Typography>
                    <Typography variant="h4">Heading 4</Typography>
                    <Typography variant="h5">Heading 5</Typography>
                    <Typography variant="h6">Heading 6</Typography>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Body Text</Typography>
                    <Typography variant="body1" gutterBottom>
                      Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Typography>
                    <Typography variant="body2">
                      Body 2: Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                      laboris nisi ut aliquip ex ea commodo consequat.
                    </Typography>
                  </div>

                  {/* Special Text */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Special Text</Typography>
                    <Typography variant="subtitle1">Subtitle 1: Emphasized text</Typography>
                    <Typography variant="subtitle2">Subtitle 2: Secondary emphasis</Typography>
                    <Typography variant="caption">Caption: Small descriptive text</Typography>
                    <Typography variant="overline">Overline: Category Label</Typography>
                  </div>

                  {/* Colors */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Colors</Typography>
                    <Typography color="primary">Primary color text</Typography>
                    <Typography color="secondary">Secondary color text</Typography>
                    <Typography color="success">Success color text</Typography>
                    <Typography color="warning">Warning color text</Typography>
                    <Typography color="error">Error color text</Typography>
                    <Typography color="info">Info color text</Typography>
                  </div>

                  {/* Text Alignment */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Alignment</Typography>
                    <Typography align="left">Left aligned text</Typography>
                    <Typography align="center">Center aligned text</Typography>
                    <Typography align="right">Right aligned text</Typography>
                  </div>
                </div>

                {/* Layout Demo */}
                <div className="space-y-4">
                  <Typography variant="h3">Layout System</Typography>
                  
                  {/* Grid Demo */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Grid Layout</Typography>
                    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
                      <div className="rounded-lg border bg-accent p-4">
                        <Typography variant="body2">Grid Item 1</Typography>
                      </div>
                      <div className="rounded-lg border bg-accent p-4">
                        <Typography variant="body2">Grid Item 2</Typography>
                      </div>
                      <div className="rounded-lg border bg-accent p-4">
                        <Typography variant="body2">Grid Item 3</Typography>
                      </div>
                      <div className="rounded-lg border bg-accent p-4">
                        <Typography variant="body2">Grid Item 4</Typography>
                      </div>
                      <div className="rounded-lg border bg-accent p-4">
                        <Typography variant="body2">Grid Item 5</Typography>
                      </div>
                      <div className="rounded-lg border bg-accent p-4">
                        <Typography variant="body2">Grid Item 6</Typography>
                      </div>
                    </Grid>
                  </div>

                  {/* Stack Demo */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Stack Layout</Typography>
                    <Stack spacing={4}>
                      <div className="rounded-lg border bg-accent p-4">
                        <Typography variant="body2">Stack Item 1 (Vertical)</Typography>
                      </div>
                      <Stack direction="row" spacing={4} align="center">
                        <div className="rounded-lg border bg-accent p-4 flex-1">
                          <Typography variant="body2">Nested Stack Item 1</Typography>
                        </div>
                        <div className="rounded-lg border bg-accent p-4 flex-1">
                          <Typography variant="body2">Nested Stack Item 2</Typography>
                        </div>
                      </Stack>
                      <Divider />
                      <div className="rounded-lg border bg-accent p-4">
                        <Typography variant="body2">Stack Item 3</Typography>
                      </div>
                    </Stack>
                  </div>
                </div>

                {/* Status Card */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <Typography variant="h3" gutterBottom>Project Status</Typography>
                  <Typography variant="body1" color="muted" gutterBottom>
                    Phase 1: Foundation & Setup ✅
                  </Typography>
                  <Typography variant="body1" color="muted">
                    Phase 2: Design System Core 🚧 (In Progress)
                  </Typography>
                </div>
                          </section>
            </Stack>
          </Container>
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