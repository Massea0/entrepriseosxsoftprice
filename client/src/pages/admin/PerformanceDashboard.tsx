import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DynamicWidget from '@/components/ui/DynamicWidget';
import GridLayout from '@/components/ui/GridLayout';
import AnimatedChart from '@/components/ui/AnimatedChart';
import PerformanceOptimizer from '@/components/ui/PerformanceOptimizer';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Zap,
  Users,
  Database,
  Gauge,
  Settings
} from 'lucide-react';

// Sample data for charts
const performanceData = [
  { name: 'Jan', value: 400, users: 240, response: 300 },
  { name: 'Feb', value: 300, users: 139, response: 280 },
  { name: 'Mar', value: 200, users: 980, response: 200 },
  { name: 'Apr', value: 278, users: 390, response: 250 },
  { name: 'May', value: 189, users: 480, response: 180 },
  { name: 'Jun', value: 239, users: 380, response: 220 }
];

const pieData = [
  { name: 'API Calls', value: 35 },
  { name: 'Database', value: 25 },
  { name: 'Frontend', value: 20 },
  { name: 'Network', value: 20 }
];

const radarData = [
  { subject: 'Performance', A: 120, B: 110, fullMark: 150 },
  { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
  { subject: 'Security', A: 86, B: 130, fullMark: 150 },
  { subject: 'Scalability', A: 99, B: 100, fullMark: 150 },
  { subject: 'User Experience', A: 85, B: 90, fullMark: 150 },
  { subject: 'Maintainability', A: 65, B: 85, fullMark: 150 }
];

export default function PerformanceDashboard() {
  const [widgets, setWidgets] = useState([
    {
      id: 'performance-monitor',
      component: (
        <PerformanceOptimizer 
          realTimeUpdate={true}
          showOptimizations={true}
          onOptimize={async (metric) => {
            console.log(`Optimizing ${metric}...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }}
        />
      ),
      size: 'xl' as const,
      span: { cols: 3, rows: 2 }
    },
    {
      id: 'response-times',
      component: (
        <DynamicWidget
          title="API Response Times"
          variant="glass"
          refreshable={true}
          onRefresh={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }}
        >
          <AnimatedChart
            type="line"
            data={performanceData}
            height={200}
            dataKey="response"
            colors={['#8884d8']}
            gradient={true}
          />
        </DynamicWidget>
      ),
      size: 'lg' as const,
      span: { cols: 2, rows: 1 }
    },
    {
      id: 'user-activity',
      component: (
        <DynamicWidget
          title="Active Users"
          variant="gradient"
          allowFullscreen={true}
        >
          <AnimatedChart
            type="area"
            data={performanceData}
            height={200}
            dataKey="users"
            colors={['#82ca9d']}
            gradient={true}
          />
        </DynamicWidget>
      ),
      size: 'lg' as const,
      span: { cols: 2, rows: 1 }
    },
    {
      id: 'resource-usage',
      component: (
        <DynamicWidget
          title="System Resources"
          variant="minimal"
          downloadable={true}
          onDownload={() => console.log('Downloading resource report...')}
        >
          <AnimatedChart
            type="pie"
            data={pieData}
            height={250}
            dataKey="value"
            colors={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c']}
          />
        </DynamicWidget>
      ),
      size: 'md' as const,
      span: { cols: 1, rows: 1 }
    },
    {
      id: 'system-health',
      component: (
        <DynamicWidget
          title="Health Radar"
          variant="glass"
          shareable={true}
          onShare={() => console.log('Sharing health report...')}
        >
          <AnimatedChart
            type="radar"
            data={radarData}
            height={250}
            dataKey="A"
            xAxisKey="subject"
            colors={['#8884d8']}
          />
        </DynamicWidget>
      ),
      size: 'md' as const,
      span: { cols: 1, rows: 1 }
    },
    {
      id: 'throughput',
      component: (
        <DynamicWidget
          title="Request Throughput"
          variant="default"
          allowCollapse={true}
        >
          <AnimatedChart
            type="bar"
            data={performanceData}
            height={200}
            dataKey="value"
            colors={['#ffc658']}
          />
        </DynamicWidget>
      ),
      size: 'lg' as const,
      span: { cols: 2, rows: 1 }
    }
  ]);

  const handleOptimizeAll = async () => {
    console.log('Running full system optimization...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Gauge className="h-8 w-8 text-primary" />
              </div>
              Performance Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring and optimization tools for your application
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <Activity className="h-3 w-3 mr-1" />
              Systems Operational
            </Badge>
            
            <Button
              onClick={handleOptimizeAll}
              className="bg-primary hover:bg-primary/90"
            >
              <Zap className="h-4 w-4 mr-2" />
              Optimize All
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Avg Response Time', 
              value: '245ms', 
              trend: '+5%', 
              icon: TrendingUp,
              color: 'text-green-600 dark:text-green-400'
            },
            { 
              label: 'Active Users', 
              value: '1,247', 
              trend: '+12%', 
              icon: Users,
              color: 'text-blue-600 dark:text-blue-400'
            },
            { 
              label: 'Database Queries', 
              value: '89ms', 
              trend: '-3%', 
              icon: Database,
              color: 'text-purple-600 dark:text-purple-400'
            },
            { 
              label: 'System Load', 
              value: '67%', 
              trend: '+2%', 
              icon: BarChart3,
              color: 'text-orange-600 dark:text-orange-400'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className={`text-xs font-medium ${stat.color}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Grid Layout */}
        <GridLayout
          items={widgets}
          onItemsChange={(newItems) => setWidgets(newItems as any)}
          columns={4}
          gap={6}
          enableDragAndDrop={true}
          responsive={true}
          className="min-h-96"
        />

        {/* Additional Info */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Top Optimizations</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Enable browser caching
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Optimize database queries
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Compress static assets
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">System Status</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    API Gateway: Healthy
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Database: Operational
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    CDN: Active
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Recent Actions</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Cache cleared - 2min ago</li>
                  <li>Database optimized - 15min ago</li>
                  <li>Performance scan - 1hr ago</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}