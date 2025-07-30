'use client';

import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { TenantProvider, useTenant } from '@/contexts/TenantContext';
import { useState } from 'react';

function DemoContent() {
  const { tenant, updateTheme } = useTenant();
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [loading, setLoading] = useState(false);

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    updateTheme({ primary: `${r} ${g} ${b}` });
  };

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Enterprise SaaS UI Components
          </h1>
          <p className="mt-2 text-muted-foreground">
            Multi-tenant design system with customizable themes
          </p>
          {tenant && (
            <p className="mt-4 text-sm text-muted-foreground">
              Tenant: <span className="font-semibold">{tenant.name}</span> | 
              Plan: <span className="font-semibold">{tenant.plan}</span>
            </p>
          )}
        </div>

        {/* Theme Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Customization</CardTitle>
            <CardDescription>
              Customize the theme for your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="primary-color" className="text-sm font-medium">
                Primary Color:
              </label>
              <input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border border-border"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Border Radius:</label>
              <div className="flex gap-2">
                {(['none', 'sm', 'md', 'lg', 'full'] as const).map((radius) => (
                  <Button
                    key={radius}
                    variant="outline"
                    size="sm"
                    onClick={() => updateTheme({ borderRadius: radius })}
                    className={tenant?.theme.borderRadius === radius ? 'ring-2 ring-primary' : ''}
                  >
                    {radius}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Various button styles and states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button loading onClick={handleClick}>
                Click to Load
              </Button>
              <Button
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                With Icon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Input Fields</CardTitle>
            <CardDescription>
              Form inputs with various configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Default Input" placeholder="Enter text..." />
            
            <Input 
              label="Required Input" 
              placeholder="This field is required" 
              required 
            />
            
            <Input 
              label="Input with Error" 
              placeholder="Enter email..." 
              error="Please enter a valid email address"
              type="email"
            />
            
            <Input 
              label="Input with Helper" 
              placeholder="Enter password..." 
              helper="Password must be at least 8 characters"
              type="password"
            />
            
            <Input 
              label="Input with Icon" 
              placeholder="Search..."
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            
            <Input 
              label="Input with Addon" 
              placeholder="0.00"
              leftAddon="€"
              type="number"
            />
            
            <div className="flex gap-4">
              <Input inputSize="sm" placeholder="Small" />
              <Input inputSize="md" placeholder="Medium" />
              <Input inputSize="lg" placeholder="Large" />
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>With small shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a default card with standard styling and small shadow.
              </p>
            </CardContent>
          </Card>
          
          <Card shadow="lg" hover>
            <CardHeader>
              <CardTitle>Hover Card</CardTitle>
              <CardDescription>With hover effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This card lifts up on hover with increased shadow.
              </p>
            </CardContent>
          </Card>
          
          <Card shadow="none" className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Custom Card</CardTitle>
              <CardDescription>No shadow, custom border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cards can be customized with different props and classes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Module Status */}
        <Card>
          <CardHeader>
            <CardTitle>Active Modules</CardTitle>
            <CardDescription>
              Modules enabled for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {tenant?.modules && Object.entries(tenant.modules).map(([moduleId, config]) => (
                <div
                  key={moduleId}
                  className={`rounded-md border p-3 ${
                    config.enabled 
                      ? 'border-success bg-success/10 text-success' 
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {config.enabled ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="text-sm font-medium capitalize">
                      {moduleId.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <TenantProvider>
      <DemoContent />
    </TenantProvider>
  );
}