import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  Layers3, 
  Sparkles, 
  Zap, 
  Eye,
  Orbit,
  Cpu,
  Waves,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataPoint {
  id: string;
  value: number;
  category: string;
  timestamp: Date;
  importance: number;
  x: number;
  y: number;
  z: number;
}

interface HolographicDashboardProps {
  data: any[];
  width?: number;
  height?: number;
  depth?: number;
  interactive?: boolean;
}

export const HolographicDashboard: React.FC<HolographicDashboardProps> = ({
  data = [],
  width = 400,
  height = 300,
  depth = 200,
  interactive = true
}) => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation des données 3D
  useEffect(() => {
    const generateDataPoints = () => {
      const points: DataPoint[] = [];
      
      for (let i = 0; i < 50; i++) {
        points.push({
          id: `point-${i}`,
          value: Math.random() * 100,
          category: ['performance', 'sales', 'users', 'revenue'][Math.floor(Math.random() * 4)],
          timestamp: new Date(Date.now() - Math.random() * 86400000),
          importance: Math.random(),
          x: (Math.random() - 0.5) * width,
          y: (Math.random() - 0.5) * height,
          z: (Math.random() - 0.5) * depth
        });
      }
      
      setDataPoints(points);
    };

    generateDataPoints();
    
    // Mise à jour périodique des données
    const interval = setInterval(generateDataPoints, 5000);
    return () => clearInterval(interval);
  }, [width, height, depth]);

  // Gestion de l'interaction 3D
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setRotationY((mouseX / rect.width) * 30);
    setRotationX((-mouseY / rect.height) * 30);
  };

  // Projection 3D vers 2D
  const project3D = (point: DataPoint) => {
    const rotX = (rotationX * Math.PI) / 180;
    const rotY = (rotationY * Math.PI) / 180;
    
    // Rotation autour de Y
    let x = point.x * Math.cos(rotY) - point.z * Math.sin(rotY);
    let z = point.x * Math.sin(rotY) + point.z * Math.cos(rotY);
    
    // Rotation autour de X
    let y = point.y * Math.cos(rotX) - z * Math.sin(rotX);
    z = point.y * Math.sin(rotX) + z * Math.cos(rotX);
    
    // Projection perspective
    const perspective = 800;
    const scale = perspective / (perspective + z);
    
    return {
      x: x * scale + width / 2,
      y: y * scale + height / 2,
      scale: scale,
      z: z
    };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'rgb(147, 51, 234)';
      case 'sales': return 'rgb(34, 197, 94)';
      case 'users': return 'rgb(59, 130, 246)';
      case 'revenue': return 'rgb(245, 158, 11)';
      default: return 'rgb(156, 163, 175)';
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-xl border border-purple-500/30"
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => {
        setIsInteracting(false);
        setRotationX(0);
        setRotationY(0);
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Grille 3D de fond */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="holographic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke="rgb(147, 51, 234)" 
                strokeWidth="1"
                opacity="0.5"
              />
            </pattern>
            <linearGradient id="holographic-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#holographic-grid)" />
        </svg>
      </div>

      {/* Points de données 3D */}
      <div className="absolute inset-0">
        {dataPoints
          .map(point => ({ ...point, projected: project3D(point) }))
          .sort((a, b) => b.projected.z - a.projected.z) // Tri par profondeur
          .map((point, index) => (
            <motion.div
              key={point.id}
              className={cn(
                "absolute rounded-full cursor-pointer",
                "shadow-lg transition-all duration-200",
                activePoint === point.id ? "z-20" : "z-10"
              )}
              style={{
                left: point.projected.x - 4,
                top: point.projected.y - 4,
                width: 8 * point.projected.scale * (1 + point.importance),
                height: 8 * point.projected.scale * (1 + point.importance),
                backgroundColor: getCategoryColor(point.category),
                boxShadow: `0 0 ${15 * point.projected.scale}px ${getCategoryColor(point.category)}`,
                opacity: Math.max(0.3, point.projected.scale),
                transform: `translateZ(${point.projected.z}px)`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: Math.max(0.3, point.projected.scale),
                transition: { delay: index * 0.01 }
              }}
              whileHover={{ 
                scale: 1.5,
                transition: { duration: 0.2 }
              }}
              onClick={() => setActivePoint(point.id === activePoint ? null : point.id)}
            >
              {/* Effet de glow animé */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${getCategoryColor(point.category)}40 0%, transparent 70%)`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0.4, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
      </div>

      {/* Connexions entre points proches */}
      <svg className="absolute inset-0 pointer-events-none">
        {dataPoints.map((point1, i) => {
          const proj1 = project3D(point1);
          return dataPoints.slice(i + 1).map((point2, j) => {
            const proj2 = project3D(point2);
            const distance = Math.sqrt(
              Math.pow(point1.x - point2.x, 2) +
              Math.pow(point1.y - point2.y, 2) +
              Math.pow(point1.z - point2.z, 2)
            );
            
            if (distance < 150) {
              return (
                <motion.line
                  key={`${point1.id}-${point2.id}`}
                  x1={proj1.x}
                  y1={proj1.y}
                  x2={proj2.x}
                  y2={proj2.y}
                  stroke="url(#holographic-glow)"
                  strokeWidth={Math.max(0.5, (1 - distance / 150) * 2)}
                  opacity={Math.max(0.1, (1 - distance / 150) * 0.5)}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: (i + j) * 0.1 }}
                />
              );
            }
            return null;
          });
        })}
      </svg>

      {/* Interface de contrôle */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
        <Layers3 className="h-4 w-4 text-purple-400" />
        <span className="text-xs text-gray-300">3D Holographic</span>
        {isInteracting && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <Orbit className="h-3 w-3 text-blue-400 " />
            <span className="text-xs text-blue-400">Interactive</span>
          </motion.div>
        )}
      </div>

      {/* Légende des catégories */}
      <div className="absolute bottom-4 right-4 space-y-1">
        {['performance', 'sales', 'users', 'revenue'].map(category => (
          <div key={category} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getCategoryColor(category) }}
            />
            <span className="text-gray-400 capitalize">{category}</span>
          </div>
        ))}
      </div>

      {/* Détails du point actif */}
      {activePoint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs"
        >
          {(() => {
            const point = dataPoints.find(p => p.id === activePoint);
            if (!point) return null;
            return (
              <div className="space-y-1">
                <div className="font-medium text-white">{point.category}</div>
                <div className="text-gray-300">Valeur: {point.value.toFixed(1)}</div>
                <div className="text-gray-400">
                  Position: ({point.x.toFixed(0)}, {point.y.toFixed(0)}, {point.z.toFixed(0)})
                </div>
                <div className="text-gray-400">
                  Importance: {(point.importance * 100).toFixed(0)}%
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Effets de particules */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};