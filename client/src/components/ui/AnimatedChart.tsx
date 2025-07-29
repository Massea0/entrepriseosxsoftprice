import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartData {
  [key: string]: any;
}

interface AnimatedChartProps {
  type: 'line' | 'area' | 'bar' | 'pie' | 'radar';
  data: ChartData[];
  title?: string;
  className?: string;
  height?: number;
  animated?: boolean;
  colors?: string[];
  dataKey?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  gradient?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  customTooltip?: React.ComponentType<any>;
}

const defaultColors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#87d068', '#ffa500', '#ff6b6b', '#4ecdc4'
];

export function AnimatedChart({
  type,
  data,
  title,
  className,
  height = 300,
  animated = true,
  colors = defaultColors,
  dataKey = 'value',
  xAxisKey = 'name',
  yAxisKey = 'value',
  gradient = true,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  customTooltip
}: AnimatedChartProps) {
  const [animatedData, setAnimatedData] = useState<ChartData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      // Animate data entry
      setAnimatedData([]);
      const timer = setTimeout(() => {
        setAnimatedData(data);
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
      setIsVisible(true);
    }
  }, [data, animated]);

  const CustomTooltip = React.useMemo(() => customTooltip || (({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  }), [customTooltip]);

  const renderChart = () => {
    const commonProps = {
      data: animatedData,
      width: '100%',
      height,
    };

    const animationProps = animated ? {
      animationBegin: 0,
      animationDuration: 1000,
      animationEasing: 'ease-out' as const
    } : {};

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={animatedData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
              <XAxis 
                dataKey={xAxisKey} 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              {gradient && (
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              )}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: colors[0] }}
                {...animationProps}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={animatedData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
              <XAxis 
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                fill={gradient ? "url(#areaGradient)" : colors[0]}
                strokeWidth={2}
                {...animationProps}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={animatedData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.3} />}
              <XAxis 
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              <Bar 
                dataKey={dataKey} 
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                {...animationProps}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              <Pie
                data={animatedData}
                cx="50%"
                cy="50%"
                outerRadius={height / 3}
                fill="#8884d8"
                dataKey={dataKey}
                label={showLegend}
                {...animationProps}
              >
                {animatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer {...commonProps}>
            <RadarChart data={animatedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey={xAxisKey} className="text-xs text-muted-foreground" />
              <PolarRadiusAxis className="text-xs text-muted-foreground" />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              <Radar
                name={dataKey}
                dataKey={dataKey}
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.3}
                {...animationProps}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('w-full', className)}
    >
      {title ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderChart()}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {renderChart()}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default AnimatedChart;