import { useState, useRef } from 'react'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TechnicalDrawingProps {
  width?: number
  height?: number
}

interface LayoutData {
  excavationLength: number
  excavationWidth: number
  usefulAreaLength: number
  usefulAreaWidth: number
  accessAreaLength: number
  accessAreaWidth: number
}

export default function TechnicalDrawing({ width = 800, height = 600 }: TechnicalDrawingProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const layoutData: LayoutData = {
    excavationLength: 22.0,
    excavationWidth: 19.0,
    usefulAreaLength: 13.0,
    usefulAreaWidth: 10.0,
    accessAreaLength: 3.0,
    accessAreaWidth: 3.0
  }

  // Scale factor to convert meters to SVG units
  const scale = 20
  const svgWidth = layoutData.excavationLength * scale
  const svgHeight = layoutData.excavationWidth * scale

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.2))
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y
    
    setPan(prev => ({
      x: prev.x + deltaX / zoom,
      y: prev.y + deltaY / zoom
    }))
    
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative w-full h-full border border-border rounded-lg overflow-hidden bg-card">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomIn}
          data-testid="button-zoom-in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomOut}
          data-testid="button-zoom-out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={resetView}
          data-testid="button-reset-view"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Scale indicator */}
      <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm border border-border rounded px-3 py-1">
        <span className="text-sm font-mono text-foreground">
          Escala: 1:{Math.round(100/zoom)}
        </span>
      </div>

      {/* SVG Drawing */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-move"
        viewBox={`${-pan.x} ${-pan.y} ${width/zoom} ${height/zoom}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-testid="svg-technical-drawing"
      >
        <defs>
          {/* Patterns for different materials */}
          <pattern id="concrete" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="hsl(var(--muted))"/>
            <path d="M0,4l4,-4M-1,1l2,-2M3,5l2,-2" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5"/>
          </pattern>
          
          <pattern id="geomembrane" patternUnits="userSpaceOnUse" width="8" height="2">
            <rect width="8" height="2" fill="hsl(var(--chart-2))"/>
            <line x1="0" y1="1" x2="8" y2="1" stroke="hsl(var(--chart-1))" strokeWidth="0.5"/>
          </pattern>
          
          <pattern id="water" patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill="hsl(var(--chart-2))" opacity="0.3"/>
            <path d="M2,8C3,6 5,6 6,8C7,10 9,10 10,8" stroke="hsl(var(--chart-2))" strokeWidth="0.8" fill="none" opacity="0.6"/>
            <path d="M0,3C1,1 3,1 4,3C5,5 7,5 8,3" stroke="hsl(var(--chart-2))" strokeWidth="0.8" fill="none" opacity="0.4"/>
          </pattern>
        </defs>

        {/* Grid */}
        <g opacity="0.3">
          {Array.from({ length: Math.ceil(layoutData.excavationLength) + 1 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * scale}
              y1={0}
              x2={i * scale}
              y2={svgHeight}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: Math.ceil(layoutData.excavationWidth) + 1 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * scale}
              x2={svgWidth}
              y2={i * scale}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Excavation boundary */}
        <rect
          x={0}
          y={0}
          width={svgWidth}
          height={svgHeight}
          fill="none"
          stroke="hsl(var(--chart-1))"
          strokeWidth="3"
          strokeDasharray="5,5"
        />

        {/* Talude 1:1,5 (slope area) */}
        <rect
          x={scale * 1.5}
          y={scale * 1.5}
          width={svgWidth - scale * 3}
          height={svgHeight - scale * 3}
          fill="hsl(var(--chart-3))"
          fillOpacity="0.2"
          stroke="hsl(var(--chart-3))"
          strokeWidth="2"
          strokeDasharray="3,3"
        />

        {/* Canal de Coroamento (perimeter) */}
        <rect
          x={scale * 0.5}
          y={scale * 0.5}
          width={svgWidth - scale}
          height={svgHeight - scale}
          fill="url(#concrete)"
          fillOpacity="0.4"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
        />

        {/* Useful area (lagoa) - centered */}
        <g>
          <rect
            x={(svgWidth - layoutData.usefulAreaLength * scale) / 2}
            y={(svgHeight - layoutData.usefulAreaWidth * scale) / 2}
            width={layoutData.usefulAreaLength * scale}
            height={layoutData.usefulAreaWidth * scale}
            fill="url(#water)"
            stroke="hsl(var(--chart-2))"
            strokeWidth="2"
          />
          
          {/* Geomembrana HDPE */}
          <rect
            x={(svgWidth - layoutData.usefulAreaLength * scale) / 2 - 2}
            y={(svgHeight - layoutData.usefulAreaWidth * scale) / 2 - 2}
            width={layoutData.usefulAreaLength * scale + 4}
            height={layoutData.usefulAreaWidth * scale + 4}
            fill="url(#geomembrane)"
            fillOpacity="0.6"
            stroke="hsl(var(--chart-1))"
            strokeWidth="1"
          />
        </g>

        {/* Access/Pumping Area */}
        <rect
          x={svgWidth - layoutData.accessAreaLength * scale - scale}
          y={scale}
          width={layoutData.accessAreaLength * scale}
          height={layoutData.accessAreaWidth * scale}
          fill="hsl(var(--muted))"
          fillOpacity="0.5"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
        />

        {/* Sedimentation Box */}
        <rect
          x={scale * 2}
          y={scale * 2}
          width={scale}
          height={scale}
          fill="hsl(var(--card))"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
        />

        {/* Pipes */}
        <g>
          {/* Inlet pipe DN150 */}
          <line
            x1={0}
            y1={svgHeight / 2}
            x2={scale * 4}
            y2={svgHeight / 2}
            stroke="hsl(var(--chart-3))"
            strokeWidth="6"
          />
          <text x={scale * 2} y={svgHeight / 2 - 8} textAnchor="middle" className="fill-chart-3 text-xs font-mono">
            DN150
          </text>

          {/* Overflow pipe DN200 */}
          <line
            x1={svgWidth - scale * 4}
            y1={svgHeight / 2}
            x2={svgWidth}
            y2={svgHeight / 2}
            stroke="hsl(var(--chart-4))"
            strokeWidth="8"
          />
          <text x={svgWidth - scale * 2} y={svgHeight / 2 - 10} textAnchor="middle" className="fill-chart-4 text-xs font-mono">
            DN200
          </text>
        </g>

        {/* Dimension lines and labels */}
        <g>
          {/* Overall length */}
          <line
            x1={0}
            y1={svgHeight + 20}
            x2={svgWidth}
            y2={svgHeight + 20}
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
            markerStart="url(#arrowhead)"
            markerEnd="url(#arrowhead)"
          />
          <text
            x={svgWidth / 2}
            y={svgHeight + 35}
            textAnchor="middle"
            className="fill-foreground text-sm font-mono"
          >
            22,0 m
          </text>

          {/* Overall width */}
          <line
            x1={-20}
            y1={0}
            x2={-20}
            y2={svgHeight}
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
            markerStart="url(#arrowhead)"
            markerEnd="url(#arrowhead)"
          />
          <text
            x={-35}
            y={svgHeight / 2}
            textAnchor="middle"
            className="fill-foreground text-sm font-mono"
            transform={`rotate(-90, -35, ${svgHeight / 2})`}
          >
            19,0 m
          </text>
        </g>

        {/* Arrow markers */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="hsl(var(--foreground))"
            />
          </marker>
        </defs>
      </svg>
    </div>
  )
}