import { useState, useRef, useCallback } from 'react'
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { defaultLayoutSpec, LayoutSpec, ViewState, MeasurementTool } from '@shared/schema'

// Layer imports
import GridLayer from './layers/GridLayer'
import BoundaryLayer from './layers/BoundaryLayer'
import SlopeLayer from './layers/SlopeLayer'
import WaterLayer from './layers/WaterLayer'
import GeomembraneLayer from './layers/GeomembraneLayer'
import PipesLayer from './layers/PipesLayer'
import AccessLayer from './layers/AccessLayer'
import DimensionsLayer from './layers/DimensionsLayer'
import AnnotationsLayer from './layers/AnnotationsLayer'

interface TechnicalDrawingProps {
  layoutSpec?: LayoutSpec
  width?: number
  height?: number
  onViewStateChange?: (viewState: ViewState) => void
  onSelectionChange?: (componentId: string | null) => void
  onMeasurementChange?: (measurement: MeasurementTool) => void
}

export default function TechnicalDrawing({ 
  layoutSpec = defaultLayoutSpec,
  width = 800, 
  height = 600,
  onViewStateChange,
  onSelectionChange,
  onMeasurementChange
}: TechnicalDrawingProps) {
  const [viewState, setViewState] = useState<ViewState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    activeTab: 'plan'
  })
  
  const [measurement, setMeasurement] = useState<MeasurementTool>({
    isActive: false
  })
  
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null)
  
  const svgRef = useRef<SVGSVGElement>(null)

  // Scale factor to convert meters to SVG units
  const scale = 20
  const svgWidth = layoutSpec.totalDimensions.length * scale
  const svgHeight = layoutSpec.totalDimensions.width * scale

  const updateViewState = useCallback((updates: Partial<ViewState>) => {
    const newViewState = { ...viewState, ...updates }
    setViewState(newViewState)
    onViewStateChange?.(newViewState)
  }, [viewState, onViewStateChange])

  const updateMeasurement = useCallback((updates: Partial<MeasurementTool>) => {
    const newMeasurement = { ...measurement, ...updates }
    setMeasurement(newMeasurement)
    onMeasurementChange?.(newMeasurement)
  }, [measurement, onMeasurementChange])

  const handleZoomIn = useCallback(() => {
    updateViewState({ zoom: Math.min(viewState.zoom * 1.2, 5) })
  }, [viewState.zoom, updateViewState])

  const handleZoomOut = useCallback(() => {
    updateViewState({ zoom: Math.max(viewState.zoom / 1.2, 0.2) })
  }, [viewState.zoom, updateViewState])

  const resetView = useCallback(() => {
    updateViewState({ zoom: 1, pan: { x: 0, y: 0 } })
  }, [updateViewState])

  const fitToView = useCallback(() => {
    const padding = 50
    const availableWidth = width - 2 * padding
    const availableHeight = height - 2 * padding
    
    const scaleX = availableWidth / svgWidth
    const scaleY = availableHeight / svgHeight
    const newZoom = Math.min(scaleX, scaleY, 2)
    
    const centerX = (width - svgWidth * newZoom) / 2
    const centerY = (height - svgHeight * newZoom) / 2
    
    updateViewState({ 
      zoom: newZoom, 
      pan: { x: -centerX / newZoom, y: -centerY / newZoom } 
    })
  }, [width, height, svgWidth, svgHeight, updateViewState])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (measurement.isActive) return
    
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }, [measurement.isActive])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || measurement.isActive) return
    
    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y
    
    updateViewState({
      pan: {
        x: viewState.pan.x + deltaX / viewState.zoom,
        y: viewState.pan.y + deltaY / viewState.zoom
      }
    })
    
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }, [isDragging, measurement.isActive, lastMousePos, viewState.pan, viewState.zoom, updateViewState])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleComponentClick = useCallback((componentId: string) => {
    const newSelectedId = viewState.selectedComponentId === componentId ? undefined : componentId
    updateViewState({ selectedComponentId: newSelectedId })
    onSelectionChange?.(newSelectedId || null)
  }, [viewState.selectedComponentId, updateViewState, onSelectionChange])

  const handleComponentHover = useCallback((componentId: string | null) => {
    setHoveredComponentId(componentId)
  }, [])

  return (
    <div className="relative w-full h-full border border-border rounded-lg overflow-hidden bg-card">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomIn}
          data-testid="button-zoom-in"
          className="bg-card/90 backdrop-blur-sm"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomOut}
          data-testid="button-zoom-out"
          className="bg-card/90 backdrop-blur-sm"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={fitToView}
          data-testid="button-fit-view"
          className="bg-card/90 backdrop-blur-sm"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={resetView}
          data-testid="button-reset-view"
          className="bg-card/90 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Status indicators */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded px-3 py-1">
          <span className="text-sm font-mono text-foreground">
            Escala: 1:{Math.round(100/viewState.zoom)}
          </span>
        </div>
        
        {hoveredComponentId && (
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded px-3 py-1">
            <span className="text-sm text-foreground">
              {layoutSpec.components.find(c => c.id === hoveredComponentId)?.name ||
               layoutSpec.pipes.find(p => p.id === hoveredComponentId)?.name}
            </span>
          </div>
        )}
        
        {measurement.distance && (
          <div className="bg-primary/90 backdrop-blur-sm border border-primary-border rounded px-3 py-1">
            <span className="text-sm text-primary-foreground font-mono">
              {measurement.distance.toFixed(2)} m
            </span>
          </div>
        )}
      </div>

      {/* SVG Drawing */}
      <svg
        ref={svgRef}
        className={`w-full h-full ${
          measurement.isActive ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        viewBox={`${-viewState.pan.x - 60} ${-viewState.pan.y - 60} ${(width + 120)/viewState.zoom} ${(height + 120)/viewState.zoom}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-testid="svg-technical-drawing"
      >
        {/* Pattern definitions */}
        <defs>
          {/* Concrete pattern */}
          <pattern id="concrete" patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="6" height="6" fill="hsl(var(--muted))"/>
            <path d="M0,6l6,-6M-1,1l2,-2M5,7l2,-2" stroke="hsl(var(--muted-foreground))" strokeWidth="0.6"/>
          </pattern>
        </defs>

        {/* Render layers in correct order (bottom to top) */}
        <GridLayer 
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          scale={scale}
          maxLength={layoutSpec.totalDimensions.length}
          maxWidth={layoutSpec.totalDimensions.width}
          visibility={layoutSpec.layerVisibility}
        />
        
        <BoundaryLayer
          components={layoutSpec.components}
          scale={scale}
          visibility={layoutSpec.layerVisibility}
          selectedId={viewState.selectedComponentId}
          onComponentClick={handleComponentClick}
          onComponentHover={handleComponentHover}
        />
        
        <SlopeLayer
          components={layoutSpec.components}
          scale={scale}
          visibility={layoutSpec.layerVisibility}
          selectedId={viewState.selectedComponentId}
          onComponentClick={handleComponentClick}
          onComponentHover={handleComponentHover}
        />
        
        <GeomembraneLayer
          components={layoutSpec.components}
          scale={scale}
          visibility={layoutSpec.layerVisibility}
          selectedId={viewState.selectedComponentId}
          onComponentClick={handleComponentClick}
          onComponentHover={handleComponentHover}
        />
        
        <WaterLayer
          components={layoutSpec.components}
          scale={scale}
          visibility={layoutSpec.layerVisibility}
          selectedId={viewState.selectedComponentId}
          onComponentClick={handleComponentClick}
          onComponentHover={handleComponentHover}
        />
        
        <PipesLayer
          pipes={layoutSpec.pipes}
          components={layoutSpec.components}
          scale={scale}
          visibility={layoutSpec.layerVisibility}
          selectedId={viewState.selectedComponentId}
          onPipeClick={handleComponentClick}
          onPipeHover={handleComponentHover}
        />
        
        <AccessLayer
          components={layoutSpec.components}
          scale={scale}
          visibility={layoutSpec.layerVisibility}
          selectedId={viewState.selectedComponentId}
          onComponentClick={handleComponentClick}
          onComponentHover={handleComponentHover}
        />
        
        <DimensionsLayer
          layoutSpec={layoutSpec}
          scale={scale}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          visibility={layoutSpec.layerVisibility}
        />
        
        <AnnotationsLayer
          layoutSpec={layoutSpec}
          scale={scale}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          visibility={layoutSpec.layerVisibility}
        />

        {/* Measurement tool overlay */}
        {measurement.isActive && measurement.startPoint && measurement.endPoint && (
          <g className="measurement-overlay">
            <line
              x1={measurement.startPoint.x}
              y1={measurement.startPoint.y}
              x2={measurement.endPoint.x}
              y2={measurement.endPoint.y}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <circle
              cx={measurement.startPoint.x}
              cy={measurement.startPoint.y}
              r="4"
              fill="hsl(var(--primary))"
            />
            <circle
              cx={measurement.endPoint.x}
              cy={measurement.endPoint.y}
              r="4"
              fill="hsl(var(--primary))"
            />
          </g>
        )}
      </svg>
    </div>
  )
}