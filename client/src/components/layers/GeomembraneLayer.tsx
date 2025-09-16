import { ComponentSpec, LayerVisibility } from '@shared/schema'

interface GeomembraneLayerProps {
  components: ComponentSpec[]
  scale: number
  visibility: LayerVisibility
  selectedId?: string
  onComponentClick?: (id: string) => void
  onComponentHover?: (id: string | null) => void
}

export default function GeomembraneLayer({ 
  components, 
  scale, 
  visibility, 
  selectedId,
  onComponentClick,
  onComponentHover 
}: GeomembraneLayerProps) {
  if (!visibility.geomembrane) return null

  const geomembrane = components.find(c => c.type === 'geomembrane')
  if (!geomembrane) return null

  return (
    <g className="geomembrane-layer">
      {/* Geomembrane pattern definition */}
      <defs>
        <pattern id="geomembranePattern" patternUnits="userSpaceOnUse" width="10" height="3">
          <rect width="10" height="3" fill="hsl(var(--chart-1))" fillOpacity="0.15"/>
          <line x1="0" y1="1.5" x2="10" y2="1.5" stroke="hsl(var(--chart-1))" strokeWidth="0.8" opacity="0.8"/>
          <line x1="0" y1="0.5" x2="10" y2="0.5" stroke="hsl(var(--chart-1))" strokeWidth="0.4" opacity="0.6"/>
          <line x1="0" y1="2.5" x2="10" y2="2.5" stroke="hsl(var(--chart-1))" strokeWidth="0.4" opacity="0.6"/>
        </pattern>

        <pattern id="hdpeTexture" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="hsl(var(--chart-1))" fillOpacity="0.08"/>
          <circle cx="2" cy="2" r="0.5" fill="hsl(var(--chart-1))" opacity="0.3"/>
          <circle cx="6" cy="6" r="0.5" fill="hsl(var(--chart-1))" opacity="0.3"/>
          <circle cx="2" cy="6" r="0.3" fill="hsl(var(--chart-1))" opacity="0.2"/>
          <circle cx="6" cy="2" r="0.3" fill="hsl(var(--chart-1))" opacity="0.2"/>
        </pattern>
      </defs>

      {/* Geomembrane area */}
      <rect
        x={geomembrane.position.x * scale}
        y={geomembrane.position.y * scale}
        width={geomembrane.dimensions.length * scale}
        height={geomembrane.dimensions.width * scale}
        fill="url(#hdpeTexture)"
        stroke="hsl(var(--chart-1))"
        strokeWidth="1.5"
        strokeDasharray="8,2"
        className={`transition-all duration-200 ${
          selectedId === geomembrane.id ? 'stroke-[2.5] drop-shadow-lg' : ''
        } hover-elevate cursor-pointer`}
        onClick={() => onComponentClick?.(geomembrane.id)}
        onMouseEnter={() => onComponentHover?.(geomembrane.id)}
        onMouseLeave={() => onComponentHover?.(null)}
        data-testid={`component-${geomembrane.id}`}
      />

      {/* Geomembrane overlap/seam indicators */}
      {visibility.annotations && (
        <g>
          {/* Horizontal seams */}
          <line
            x1={(geomembrane.position.x + 2) * scale}
            y1={(geomembrane.position.y + geomembrane.dimensions.width / 3) * scale}
            x2={(geomembrane.position.x + geomembrane.dimensions.length - 2) * scale}
            y2={(geomembrane.position.y + geomembrane.dimensions.width / 3) * scale}
            stroke="hsl(var(--chart-1))"
            strokeWidth="0.8"
            strokeDasharray="3,2"
            opacity="0.7"
          />
          <line
            x1={(geomembrane.position.x + 2) * scale}
            y1={(geomembrane.position.y + geomembrane.dimensions.width * 2/3) * scale}
            x2={(geomembrane.position.x + geomembrane.dimensions.length - 2) * scale}
            y2={(geomembrane.position.y + geomembrane.dimensions.width * 2/3) * scale}
            stroke="hsl(var(--chart-1))"
            strokeWidth="0.8"
            strokeDasharray="3,2"
            opacity="0.7"
          />
          
          {/* Vertical seams */}
          <line
            x1={(geomembrane.position.x + geomembrane.dimensions.length / 2) * scale}
            y1={(geomembrane.position.y + 1) * scale}
            x2={(geomembrane.position.x + geomembrane.dimensions.length / 2) * scale}
            y2={(geomembrane.position.y + geomembrane.dimensions.width - 1) * scale}
            stroke="hsl(var(--chart-1))"
            strokeWidth="0.8"
            strokeDasharray="3,2"
            opacity="0.7"
          />
        </g>
      )}

      {/* Material specification callout */}
      {visibility.labels && (
        <g>
          {/* Leader line */}
          <line
            x1={(geomembrane.position.x + geomembrane.dimensions.length) * scale}
            y1={geomembrane.position.y * scale}
            x2={(geomembrane.position.x + geomembrane.dimensions.length + 2) * scale}
            y2={(geomembrane.position.y - 2) * scale}
            stroke="hsl(var(--chart-1))"
            strokeWidth="1"
          />
          
          {/* Callout text */}
          <text
            x={(geomembrane.position.x + geomembrane.dimensions.length + 2.5) * scale}
            y={(geomembrane.position.y - 2) * scale}
            className="fill-chart-1 text-xs font-bold pointer-events-none"
          >
            GEOMEMBRANA
          </text>
          <text
            x={(geomembrane.position.x + geomembrane.dimensions.length + 2.5) * scale}
            y={(geomembrane.position.y - 0.8) * scale}
            className="fill-chart-1 text-xs font-medium pointer-events-none"
          >
            HDPE 1,0mm
          </text>
        </g>
      )}
    </g>
  )
}