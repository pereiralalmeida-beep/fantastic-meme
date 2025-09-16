import { ComponentSpec, LayerVisibility } from '@shared/schema'

interface WaterLayerProps {
  components: ComponentSpec[]
  scale: number
  visibility: LayerVisibility
  selectedId?: string
  onComponentClick?: (id: string) => void
  onComponentHover?: (id: string | null) => void
}

export default function WaterLayer({ 
  components, 
  scale, 
  visibility, 
  selectedId,
  onComponentClick,
  onComponentHover 
}: WaterLayerProps) {
  if (!visibility.water) return null

  const usefulArea = components.find(c => c.type === 'useful_area')
  if (!usefulArea) return null

  return (
    <g className="water-layer">
      {/* Water pattern definition */}
      <defs>
        <pattern id="waterPattern" patternUnits="userSpaceOnUse" width="12" height="8">
          <rect width="12" height="8" fill="hsl(var(--chart-2))" fillOpacity="0.2"/>
          <path 
            d="M2,6C3,4 5,4 6,6C7,8 9,8 10,6" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.7"
          />
          <path 
            d="M1,2C2,1 4,1 5,2C6,3 8,3 9,2" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth="0.8" 
            fill="none" 
            opacity="0.5"
          />
        </pattern>
        
        <pattern id="waterRipple" patternUnits="userSpaceOnUse" width="20" height="20">
          <circle cx="10" cy="10" r="3" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="0.5" opacity="0.3"/>
          <circle cx="10" cy="10" r="6" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="0.3" opacity="0.2"/>
          <circle cx="10" cy="10" r="9" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="0.2" opacity="0.1"/>
        </pattern>
      </defs>

      {/* Main water area */}
      <rect
        x={usefulArea.position.x * scale}
        y={usefulArea.position.y * scale}
        width={usefulArea.dimensions.length * scale}
        height={usefulArea.dimensions.width * scale}
        fill="url(#waterPattern)"
        stroke="hsl(var(--chart-2))"
        strokeWidth="2.5"
        className={`transition-all duration-200 ${
          selectedId === usefulArea.id ? 'stroke-[4] drop-shadow-lg' : ''
        } hover-elevate cursor-pointer`}
        onClick={() => onComponentClick?.(usefulArea.id)}
        onMouseEnter={() => onComponentHover?.(usefulArea.id)}
        onMouseLeave={() => onComponentHover?.(null)}
        data-testid={`component-${usefulArea.id}`}
      />

      {/* Water surface ripples for visual effect */}
      <rect
        x={usefulArea.position.x * scale + 10}
        y={usefulArea.position.y * scale + 10}
        width={usefulArea.dimensions.length * scale - 20}
        height={usefulArea.dimensions.width * scale - 20}
        fill="url(#waterRipple)"
        opacity="0.4"
        className="pointer-events-none"
      />

      {/* Water level indicator */}
      {visibility.annotations && (
        <g>
          <line
            x1={usefulArea.position.x * scale}
            y1={(usefulArea.position.y + usefulArea.dimensions.width * 0.3) * scale}
            x2={(usefulArea.position.x + usefulArea.dimensions.length) * scale}
            y2={(usefulArea.position.y + usefulArea.dimensions.width * 0.3) * scale}
            stroke="hsl(var(--chart-2))"
            strokeWidth="1.5"
            strokeDasharray="10,5"
            opacity="0.8"
          />
          
          <text
            x={(usefulArea.position.x + usefulArea.dimensions.length - 2) * scale}
            y={(usefulArea.position.y + usefulArea.dimensions.width * 0.3) * scale - 5}
            className="fill-chart-2 text-xs font-medium pointer-events-none"
            textAnchor="end"
          >
            N.A.
          </text>
        </g>
      )}

      {/* Centerlines */}
      {visibility.annotations && (
        <g>
          {/* Horizontal centerline */}
          <line
            x1={usefulArea.position.x * scale}
            y1={(usefulArea.position.y + usefulArea.dimensions.width / 2) * scale}
            x2={(usefulArea.position.x + usefulArea.dimensions.length) * scale}
            y2={(usefulArea.position.y + usefulArea.dimensions.width / 2) * scale}
            stroke="hsl(var(--foreground))"
            strokeWidth="0.8"
            strokeDasharray="15,5,2,5"
            opacity="0.6"
          />
          
          {/* Vertical centerline */}
          <line
            x1={(usefulArea.position.x + usefulArea.dimensions.length / 2) * scale}
            y1={usefulArea.position.y * scale}
            x2={(usefulArea.position.x + usefulArea.dimensions.length / 2) * scale}
            y2={(usefulArea.position.y + usefulArea.dimensions.width) * scale}
            stroke="hsl(var(--foreground))"
            strokeWidth="0.8"
            strokeDasharray="15,5,2,5"
            opacity="0.6"
          />
        </g>
      )}

      {/* Label */}
      {visibility.labels && (
        <text
          x={(usefulArea.position.x + usefulArea.dimensions.length / 2) * scale}
          y={(usefulArea.position.y + usefulArea.dimensions.width / 2) * scale}
          textAnchor="middle"
          className="fill-chart-2 text-sm font-bold pointer-events-none drop-shadow-sm"
        >
          LAGOA
        </text>
      )}
    </g>
  )
}