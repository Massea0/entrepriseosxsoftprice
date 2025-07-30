import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@/contexts/theme-context'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioItem } from '@/components/ui/radio'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarActions } from '@/components/ui/navbar'
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb'
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsBadge } from '@/components/ui/tabs'
import { Container, Grid, Stack, Divider } from '@/components/layout'
import { Search, Mail, Lock, ArrowRight, Heart, MessageCircle, Share2, Home, Users, Settings, BarChart3, Package, ShoppingCart } from 'lucide-react'
import '@/styles/globals.css'

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors">
        {/* Navbar Demo */}
        <Navbar variant="blur">
          <NavbarBrand href="/">
            <Typography variant="h5" weight="semibold">
              Enterprise OS
            </Typography>
          </NavbarBrand>
          <NavbarContent>
            <NavbarItem href="#" active>Dashboard</NavbarItem>
            <NavbarItem href="#">Products</NavbarItem>
            <NavbarItem href="#">Customers</NavbarItem>
            <NavbarItem href="#">Analytics</NavbarItem>
          </NavbarContent>
          <NavbarActions>
            <Button variant="ghost" size="sm" iconOnly>
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button size="sm">Sign In</Button>
          </NavbarActions>
        </Navbar>

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

              {/* Navigation Components Demo */}
              <section className="space-y-6">
                <Typography variant="h2">Navigation Components</Typography>

                {/* Breadcrumb Demo */}
                <div className="space-y-4">
                  <Typography variant="h3">Breadcrumb</Typography>
                  
                  <Card>
                    <CardContent>
                      <Stack spacing={4}>
                        <div>
                          <Typography variant="caption" color="muted" gutterBottom>
                            Basic Breadcrumb
                          </Typography>
                          <Breadcrumb>
                            <BreadcrumbItem href="/">Home</BreadcrumbItem>
                            <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                            <BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
                            <BreadcrumbItem current>Smartphones</BreadcrumbItem>
                          </Breadcrumb>
                        </div>

                        <div>
                          <Typography variant="caption" color="muted" gutterBottom>
                            With Home Icon
                          </Typography>
                          <Breadcrumb showHome>
                            <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
                            <BreadcrumbItem href="/analytics">Analytics</BreadcrumbItem>
                            <BreadcrumbItem current>Revenue Report</BreadcrumbItem>
                          </Breadcrumb>
                        </div>

                        <div>
                          <Typography variant="caption" color="muted" gutterBottom>
                            Custom Separator & Icons
                          </Typography>
                          <Breadcrumb separator="/">
                            <BreadcrumbItem href="/" icon={<Home className="h-4 w-4" />}>
                              Home
                            </BreadcrumbItem>
                            <BreadcrumbItem href="/users" icon={<Users className="h-4 w-4" />}>
                              Users
                            </BreadcrumbItem>
                            <BreadcrumbItem icon={<Settings className="h-4 w-4" />} current>
                              Settings
                            </BreadcrumbItem>
                          </Breadcrumb>
                        </div>

                        <div>
                          <Typography variant="caption" color="muted" gutterBottom>
                            Long Path (Responsive)
                          </Typography>
                          <Breadcrumb maxItemsMobile={2}>
                            <BreadcrumbItem href="/">Enterprise OS</BreadcrumbItem>
                            <BreadcrumbItem href="/crm">CRM</BreadcrumbItem>
                            <BreadcrumbItem href="/crm/customers">Customers</BreadcrumbItem>
                            <BreadcrumbItem href="/crm/customers/segments">Segments</BreadcrumbItem>
                            <BreadcrumbItem href="/crm/customers/segments/vip">VIP</BreadcrumbItem>
                            <BreadcrumbItem current>John Doe</BreadcrumbItem>
                          </Breadcrumb>
                        </div>
                      </Stack>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabs Demo */}
                <div className="space-y-4">
                  <Typography variant="h3">Tabs</Typography>
                  
                  <Grid cols={{ base: 1, md: 2 }} gap={4}>
                    {/* Default Tabs */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Default Tabs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="overview">
                          <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                          </TabsList>
                          <TabsContent value="overview">
                            <Typography variant="body2">
                              Overview content - View your dashboard summary and key metrics.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="analytics">
                            <Typography variant="body2">
                              Analytics content - Dive deep into your data and insights.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="reports">
                            <Typography variant="body2">
                              Reports content - Generate and download custom reports.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="notifications">
                            <Typography variant="body2">
                              Notifications content - Manage your alerts and notifications.
                            </Typography>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>

                    {/* Pills Tabs */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Pills Variant</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="profile">
                          <TabsList variant="pills">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="team">Team</TabsTrigger>
                            <TabsTrigger value="billing">Billing</TabsTrigger>
                          </TabsList>
                          <TabsContent value="profile">
                            <Typography variant="body2">
                              Update your profile information and preferences.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="password">
                            <Typography variant="body2">
                              Change your password and security settings.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="team">
                            <Typography variant="body2">
                              Manage your team members and permissions.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="billing">
                            <Typography variant="body2">
                              View and manage your billing information.
                            </Typography>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>

                    {/* Underline Tabs */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Underline Variant</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="products">
                          <TabsList variant="underline">
                            <TabsTrigger value="products">
                              Products
                            </TabsTrigger>
                            <TabsTrigger value="inventory">
                              Inventory
                            </TabsTrigger>
                            <TabsTrigger value="orders">
                              Orders
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="products">
                            <Typography variant="body2">
                              Manage your product catalog and listings.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="inventory">
                            <Typography variant="body2">
                              Track inventory levels and stock movements.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="orders">
                            <Typography variant="body2">
                              View and process customer orders.
                            </Typography>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>

                    {/* Tabs with Icons and Badges */}
                    <Card>
                      <CardHeader>
                        <CardTitle>With Icons & Badges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="dashboard">
                          <TabsList>
                            <TabsTrigger 
                              value="dashboard"
                              icon={<BarChart3 className="h-4 w-4" />}
                            >
                              Dashboard
                            </TabsTrigger>
                            <TabsTrigger 
                              value="orders"
                              icon={<ShoppingCart className="h-4 w-4" />}
                              badge={<TabsBadge variant="destructive">12</TabsBadge>}
                            >
                              Orders
                            </TabsTrigger>
                            <TabsTrigger 
                              value="products"
                              icon={<Package className="h-4 w-4" />}
                              badge={<TabsBadge>New</TabsBadge>}
                            >
                              Products
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="dashboard">
                            <Typography variant="body2">
                              Dashboard with real-time metrics and KPIs.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="orders">
                            <Typography variant="body2">
                              You have 12 pending orders to process.
                            </Typography>
                          </TabsContent>
                          <TabsContent value="products">
                            <Typography variant="body2">
                              Check out the new product features!
                            </Typography>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </Grid>
                </div>

                {/* Navbar Variants */}
                <div className="space-y-4">
                  <Typography variant="h3">Navbar Variants</Typography>
                  <Typography variant="body2" color="muted">
                    The navbar at the top of the page demonstrates the blur variant. Other variants include:
                  </Typography>
                  <Stack spacing={2}>
                    <Typography variant="body2">• <strong>Default:</strong> Standard background with border</Typography>
                    <Typography variant="body2">• <strong>Transparent:</strong> No background (for hero sections)</Typography>
                    <Typography variant="body2">• <strong>Blur:</strong> Glassmorphism effect (current demo)</Typography>
                    <Typography variant="body2">• <strong>Filled:</strong> Card background color</Typography>
                  </Stack>
                </div>
              </section>

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

                  {/* Selection Controls */}
                  <div className="space-y-2">
                    <Typography variant="h4" color="muted">Selection Controls</Typography>
                    <Grid cols={{ base: 1, md: 2 }} gap={6}>
                      {/* Checkbox Examples */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Checkbox</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Stack spacing={4}>
                            <Checkbox label="Default checkbox" />
                            <Checkbox 
                              label="With description" 
                              description="This is a helpful description text"
                            />
                            <Checkbox 
                              label="Required field" 
                              required
                              errorMessage="This field is required"
                            />
                            <Checkbox label="Disabled" disabled />
                            <Checkbox label="Checked by default" defaultChecked />
                            <div className="space-y-2">
                              <Typography variant="caption" color="muted">Variants:</Typography>
                              <Stack spacing={2}>
                                <Checkbox variant="outline" label="Outline" defaultChecked />
                                <Checkbox variant="filled" label="Filled" defaultChecked />
                                <Checkbox variant="ghost" label="Ghost" defaultChecked />
                              </Stack>
                            </div>
                            <div className="space-y-2">
                              <Typography variant="caption" color="muted">Colors:</Typography>
                              <Stack spacing={2}>
                                <Checkbox color="success" label="Success" defaultChecked />
                                <Checkbox color="warning" label="Warning" defaultChecked />
                                <Checkbox color="error" label="Error" defaultChecked />
                              </Stack>
                            </div>
                            <Checkbox 
                              indeterminate 
                              label="Indeterminate state"
                              description="Used for parent checkboxes with mixed children"
                            />
                          </Stack>
                        </CardContent>
                      </Card>

                      {/* Radio Examples */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Radio Group</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Stack spacing={4}>
                            <RadioGroup 
                              label="Select your plan" 
                              defaultValue="pro"
                              description="Choose the plan that best fits your needs"
                            >
                              <RadioItem value="free" label="Free" description="$0/month" />
                              <RadioItem value="pro" label="Pro" description="$10/month" />
                              <RadioItem value="enterprise" label="Enterprise" description="Contact us" />
                            </RadioGroup>

                            <Divider />

                            <RadioGroup label="Horizontal layout" direction="horizontal" defaultValue="1">
                              <RadioItem value="1" label="Option 1" />
                              <RadioItem value="2" label="Option 2" />
                              <RadioItem value="3" label="Option 3" />
                            </RadioGroup>

                            <Divider />

                            <RadioGroup label="Different variants" defaultValue="default">
                              <RadioItem value="default" label="Default" />
                              <RadioItem value="outline" label="Outline" variant="outline" />
                              <RadioItem value="filled" label="Filled" variant="filled" />
                              <RadioItem value="ghost" label="Ghost" variant="ghost" />
                            </RadioGroup>

                            <Divider />

                            <RadioGroup label="Colors" defaultValue="success">
                              <RadioItem value="success" label="Success" color="success" />
                              <RadioItem value="warning" label="Warning" color="warning" />
                              <RadioItem value="error" label="Error" color="error" />
                            </RadioGroup>
                          </Stack>
                        </CardContent>
                      </Card>

                      {/* Switch Examples */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Switch</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Stack spacing={4}>
                            <Switch label="Default switch" />
                            <Switch 
                              label="With description" 
                              description="Enable to receive notifications"
                            />
                            <Switch 
                              label="Error state" 
                              errorMessage="Something went wrong"
                            />
                            <Switch label="Disabled" disabled />
                            <Switch label="Checked by default" defaultChecked />
                            
                            <div className="space-y-2">
                              <Typography variant="caption" color="muted">Variants:</Typography>
                              <Stack spacing={2}>
                                <Switch variant="outline" label="Outline" defaultChecked />
                                <Switch variant="filled" label="Filled" defaultChecked />
                                <Switch variant="ghost" label="Ghost" defaultChecked />
                              </Stack>
                            </div>

                            <div className="space-y-2">
                              <Typography variant="caption" color="muted">Sizes:</Typography>
                              <Stack spacing={2}>
                                <Switch size="sm" label="Small" />
                                <Switch size="md" label="Medium" />
                                <Switch size="lg" label="Large" />
                              </Stack>
                            </div>

                            <div className="space-y-2">
                              <Typography variant="caption" color="muted">Colors:</Typography>
                              <Stack spacing={2}>
                                <Switch color="success" label="Success" defaultChecked />
                                <Switch color="warning" label="Warning" defaultChecked />
                                <Switch color="error" label="Error" defaultChecked />
                              </Stack>
                            </div>
                          </Stack>
                        </CardContent>
                      </Card>

                      {/* Mixed Form Example */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Form Example</CardTitle>
                          <CardDescription>Combining different form controls</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Stack spacing={4}>
                            <Input 
                              label="Project Name" 
                              placeholder="My awesome project"
                              required
                            />
                            
                            <Select
                              label="Project Type"
                              placeholder="Select a type"
                              options={[
                                { value: 'web', label: 'Web Application' },
                                { value: 'mobile', label: 'Mobile App' },
                                { value: 'api', label: 'API Service' },
                                { value: 'other', label: 'Other' },
                              ]}
                            />

                            <RadioGroup label="Visibility" defaultValue="private">
                              <RadioItem value="public" label="Public" description="Anyone can see this project" />
                              <RadioItem value="private" label="Private" description="Only you can see this project" />
                            </RadioGroup>

                            <Stack spacing={3}>
                              <Typography variant="body2" weight="medium">Features</Typography>
                              <Checkbox label="Enable CI/CD" defaultChecked />
                              <Checkbox label="Auto-deploy to production" />
                              <Checkbox label="Enable monitoring" defaultChecked />
                            </Stack>

                            <Switch 
                              label="Advanced settings" 
                              description="Show advanced configuration options"
                            />

                            <Stack direction="row" spacing={2} className="pt-4">
                              <Button variant="ghost">Cancel</Button>
                              <Button>Create Project</Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
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