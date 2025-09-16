import { ComponentSpec, LayerVisibility } from '@shared/schema'

interface SlopeLayerProps {
  components: ComponentSpec[]
  scale: number
  visibility: LayerVisibility
  selectedId?: string
  onComponentClick?: (id: string) => void
  onComponentHover?: (id: string | null) => void
}

export default function SlopeLayer({ 
  components, 
  scale, 
  visibility, 
  selectedId,
  onComponentClick,
  onComponentHover 
}: SlopeLayerProps) {
  if (!visibility.slope) return null

  const slope = components.find(c => c.type === 'slope')
  if (!slope) return null

  return (
    <g className="slope-layer">
      {/* Slope area with hatching pattern */}
      <defs>
        <pattern id="slopePattern" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="hsl(var(--chart-3))" fillOpacity="0.1"/>
          <path d="M0,6l6,-6M-1.5,1.5l3,-3M4.5,7.5l3,-3" stroke="hsl(var(--chart-3))" strokeWidth="0.8" opacity="0.6"/>
        </pattern>
      </defs>
      
      <rect
        x={slope.position.x * scale}
        y={slope.position.y * scale}
        width={slope.dimensions.length * scale}
        height={slope.dimensions.width * scale}
        fill="url(#slopePattern)"
        stroke="hsl(var(--chart-3))"
        strokeWidth="2"
        strokeDasharray="6,3"
        className={`transition-all duration-200 ${
          selectedId === slope.id ? 'stroke-[3] drop-shadow-lg' : ''
        } hover-elevate cursor-pointer`}
        onClick={() => onComponentClick?.(slope.id)}
        onMouseEnter={() => onComponentHover?.(slope.id)}
        onMouseLeave={() => onComponentHover?.(null)}
        data-testid={`component-${slope.id}`}
      />

      {/* Slope annotation */}
      {visibility.annotations && (
        <g>
          <text
            x={(slope.position.x + slope.dimensions.length / 2) * scale}
            y={(slope.position.y + slope.dimensions.width / 2) * scale}
            textAnchor="middle"
            className="fill-chart-3 text-lg font-bold pointer-events-none"
            transform={`rotate(-15, ${(slope.position.x + slope.dimensions.length / 2) * scale}, ${(slope.position.y + slope.dimensions.width / 2) * scale})`}
          >
            TALUDE 1:1,5
          </text>
          
          {/* Arrow indicating slope direction */}
          <defs>
            <marker
              id="slopeArrow"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill="hsl(var(--chart-3))"
              />
            </marker>
          </defs>
          
          <line
            x1={(slope.position.x + 2) * scale}
            y1={(slope.position.y + 2) * scale}
            x2={(slope.position.x + 5) * scale}
            y2={(slope.position.y + 5) * scale}
            stroke="hsl(var(--chart-3))"
            strokeWidth="2"
            markerEnd="url(#slopeArrow)"
          />
        </g>
      )}

      {/* Label */}
      {visibility.labels && (
        <text
          x={(slope.position.x * scale) + 10}
          y={(slope.position.y * scale) - 5}
          className="fill-chart-3 text-sm font-medium pointer-events-none"
        >
          {slope.name}
        </text>
      )}
    </g>
  )
}