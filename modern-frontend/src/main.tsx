import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Container, Grid, Stack, Divider } from '@/components/layout'
import { Search, Mail, Lock, ArrowRight, Heart, MessageCircle, Share2 } from 'lucide-react'
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

                {/* Form Components Demo */}
                <div className="space-y-4">
                  <Typography variant="h3">Form Components</Typography>
                  
                  {/* Input Variants */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Input Variants</Typography>
                    <Grid cols={{ base: 1, md: 2 }} gap={4}>
                      <Input
                        label="Default Input"
                        placeholder="Enter text..."
                        helperText="This is a helper text"
                      />
                      <Input
                        variant="filled"
                        label="Filled Input"
                        placeholder="Enter text..."
                      />
                      <Input
                        variant="flushed"
                        label="Flushed Input"
                        placeholder="Enter text..."
                      />
                      <Input
                        variant="ghost"
                        label="Ghost Input"
                        placeholder="Enter text..."
                      />
                    </Grid>
                  </div>

                  {/* Input with Icons */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Input with Icons</Typography>
                    <Grid cols={{ base: 1, md: 2 }} gap={4}>
                      <Input
                        leftElement={<Search className="h-4 w-4" />}
                        placeholder="Search..."
                      />
                      <Input
                        leftElement={<Mail className="h-4 w-4" />}
                        rightElement={<span className="text-xs text-muted-foreground">@example.com</span>}
                        placeholder="Email address"
                        type="email"
                      />
                    </Grid>
                  </div>

                  {/* Input States */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Input States</Typography>
                    <Grid cols={{ base: 1, md: 2 }} gap={4}>
                      <Input
                        label="Error State"
                        placeholder="Enter password..."
                        type="password"
                        leftElement={<Lock className="h-4 w-4" />}
                        errorMessage="Password must be at least 8 characters"
                      />
                      <Input
                        label="Disabled State"
                        placeholder="Cannot edit..."
                        disabled
                        value="Disabled input"
                      />
                    </Grid>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Textarea</Typography>
                    <Grid cols={{ base: 1, md: 2 }} gap={4}>
                      <Textarea
                        label="Default Textarea"
                        placeholder="Enter your message..."
                        helperText="Maximum 500 characters"
                        rows={4}
                      />
                      <Textarea
                        label="Auto-resize Textarea"
                        placeholder="This textarea will grow as you type..."
                        autoResize
                        minRows={3}
                        maxRows={8}
                      />
                    </Grid>
                  </div>

                  {/* Select */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Select</Typography>
                    <Grid cols={{ base: 1, md: 2 }} gap={4}>
                      <Select
                        label="Country"
                        placeholder="Select a country"
                        options={[
                          { value: 'fr', label: 'France' },
                          { value: 'us', label: 'United States' },
                          { value: 'uk', label: 'United Kingdom' },
                          { value: 'de', label: 'Germany' },
                          { value: 'es', label: 'Spain' },
                        ]}
                        helperText="Select your country of residence"
                      />
                      <Select
                        label="Category"
                        placeholder="Choose a category"
                        options={[
                          { value: 'fruit-apple', label: 'Apple', group: 'Fruits' },
                          { value: 'fruit-banana', label: 'Banana', group: 'Fruits' },
                          { value: 'fruit-orange', label: 'Orange', group: 'Fruits' },
                          { value: 'veg-carrot', label: 'Carrot', group: 'Vegetables' },
                          { value: 'veg-broccoli', label: 'Broccoli', group: 'Vegetables' },
                          { value: 'dairy-milk', label: 'Milk', group: 'Dairy' },
                          { value: 'dairy-cheese', label: 'Cheese', group: 'Dairy' },
                        ]}
                      />
                    </Grid>
                  </div>
                </div>

                {/* Card Components Demo */}
                <div className="space-y-4">
                  <Typography variant="h3">Card Components</Typography>
                  
                  {/* Card Variants */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Card Variants</Typography>
                    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Default Card</CardTitle>
                          <CardDescription>This is a default card style</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Typography variant="body2">
                            Standard card with subtle shadow and background.
                          </Typography>
                        </CardContent>
                      </Card>
                      
                      <Card variant="bordered">
                        <CardHeader>
                          <CardTitle>Bordered Card</CardTitle>
                          <CardDescription>Card with border</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Typography variant="body2">
                            This card has a visible border.
                          </Typography>
                        </CardContent>
                      </Card>
                      
                      <Card variant="elevated">
                        <CardHeader>
                          <CardTitle>Elevated Card</CardTitle>
                          <CardDescription>Card with elevation</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Typography variant="body2">
                            Higher shadow for more emphasis.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>

                  {/* Interactive Cards */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Interactive Cards</Typography>
                    <Grid cols={{ base: 1, md: 2 }} gap={4}>
                      <Card interactive variant="bordered">
                        <CardHeader>
                          <CardTitle>Clickable Card</CardTitle>
                          <CardDescription>This entire card is interactive</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Typography variant="body2">
                            Hover and click me to see the interactive effects. Perfect for navigation cards.
                          </Typography>
                        </CardContent>
                        <CardFooter>
                          <Typography variant="body2" className="flex items-center gap-2 text-primary">
                            Learn more <ArrowRight className="h-4 w-4" />
                          </Typography>
                        </CardFooter>
                      </Card>
                      
                      <Card glass className="bg-gradient-to-br from-primary/10 to-purple-500/10">
                        <CardHeader>
                          <CardTitle>Glassmorphism Card</CardTitle>
                          <CardDescription>Modern glass effect</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Typography variant="body2">
                            This card uses backdrop blur and transparency for a modern glass effect.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>

                  {/* Complex Card Example */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Complex Card Example</Typography>
                    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={4}>
                      <Card>
                        <CardHeader divider>
                          <Stack direction="row" justify="between" align="start">
                            <div>
                              <CardTitle>Article Card</CardTitle>
                              <CardDescription>5 min read • By John Doe</CardDescription>
                            </div>
                            <Button size="sm" variant="ghost" iconOnly>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </Stack>
                        </CardHeader>
                        <CardContent>
                          <Typography variant="body2" gutterBottom>
                            This is an example of a more complex card layout with multiple sections,
                            actions, and information hierarchy.
                          </Typography>
                          <Stack direction="row" spacing={4} className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" /> 42
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" /> 12
                            </span>
                          </Stack>
                        </CardContent>
                        <CardFooter divider align="between">
                          <Button size="sm" variant="ghost">Cancel</Button>
                          <Button size="sm">Read More</Button>
                        </CardFooter>
                      </Card>

                      <Card variant="filled" padding="none">
                        <div className="aspect-video bg-gradient-to-br from-primary to-purple-600" />
                        <CardHeader>
                          <CardTitle>Media Card</CardTitle>
                          <CardDescription>Card with media content</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Typography variant="body2">
                            Cards can contain images, videos, or other media elements.
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card variant="bordered" padding="sm">
                        <CardContent noPadding>
                          <Stack spacing={2}>
                            <Typography variant="h6">Quick Stats</Typography>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Typography variant="caption" color="muted">Revenue</Typography>
                                <Typography variant="h4">€42.5k</Typography>
                              </div>
                              <div>
                                <Typography variant="caption" color="muted">Growth</Typography>
                                <Typography variant="h4" color="success">+12%</Typography>
                              </div>
                            </div>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>
                </div>

                {/* Status Card */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Project Status</CardTitle>
                    <CardDescription>Enterprise OS Frontend Development</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Stack spacing={3}>
                      <div>
                        <Typography variant="body1" className="flex items-center gap-2">
                          <span className="text-green-600">✅</span> Phase 1: Foundation & Setup
                        </Typography>
                        <Typography variant="caption" color="muted" className="ml-7">
                          Completed - All configuration and setup done
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1" className="flex items-center gap-2">
                          <span className="text-green-600">✅</span> Phase 2: Design System Core
                        </Typography>
                        <Typography variant="caption" color="muted" className="ml-7">
                          Completed - Theme, Typography, Layout, Utilities
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1" className="flex items-center gap-2">
                          <span className="text-yellow-600">🚧</span> Phase 3: Component Library
                        </Typography>
                        <Typography variant="caption" color="muted" className="ml-7">
                          In Progress - Building UI components
                        </Typography>
                      </div>
                    </Stack>
                  </CardContent>
                  <CardFooter divider>
                    <Typography variant="caption" color="muted">
                      Progress: 35% Complete
                    </Typography>
                  </CardFooter>
                </Card>
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