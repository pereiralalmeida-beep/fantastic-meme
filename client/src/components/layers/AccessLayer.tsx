import { ComponentSpec, LayerVisibility } from '@shared/schema'

interface AccessLayerProps {
  components: ComponentSpec[]
  scale: number
  visibility: LayerVisibility
  selectedId?: string
  onComponentClick?: (id: string) => void
  onComponentHover?: (id: string | null) => void
}

export default function AccessLayer({ 
  components, 
  scale, 
  visibility, 
  selectedId,
  onComponentClick,
  onComponentHover 
}: AccessLayerProps) {
  if (!visibility.access) return null

  const accessArea = components.find(c => c.type === 'access_area')
  if (!accessArea) return null

  return (
    <g className="access-layer">
      {/* Access area pattern */}
      <defs>
        <pattern id="accessPattern" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="hsl(var(--muted))" fillOpacity="0.3"/>
          <rect x="0" y="0" width="2" height="2" fill="hsl(var(--muted-foreground))" opacity="0.4"/>
          <rect x="4" y="4" width="2" height="2" fill="hsl(var(--muted-foreground))" opacity="0.4"/>
          <rect x="2" y="2" width="2" height="2" fill="hsl(var(--muted-foreground))" opacity="0.2"/>
        </pattern>
      </defs>

      {/* Access area */}
      <rect
        x={accessArea.position.x * scale}
        y={accessArea.position.y * scale}
        width={accessArea.dimensions.length * scale}
        height={accessArea.dimensions.width * scale}
        fill="url(#accessPattern)"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="2"
        strokeDasharray="4,2"
        className={`transition-all duration-200 ${
          selectedId === accessArea.id ? 'stroke-[3] drop-shadow-lg' : ''
        } hover-elevate cursor-pointer`}
        onClick={() => onComponentClick?.(accessArea.id)}
        onMouseEnter={() => onComponentHover?.(accessArea.id)}
        onMouseLeave={() => onComponentHover?.(null)}
        data-testid={`component-${accessArea.id}`}
      />

      {/* Access equipment symbols */}
      {visibility.annotations && (
        <g>
          {/* Pump symbol */}
          <circle
            cx={(accessArea.position.x + 1) * scale}
            cy={(accessArea.position.y + 1) * scale}
            r={scale * 0.3}
            fill="hsl(var(--chart-5))"
            stroke="hsl(var(--foreground))"
            strokeWidth="1.5"
          />
          <text
            x={(accessArea.position.x + 1) * scale}
            y={(accessArea.position.y + 1.1) * scale}
            textAnchor="middle"
            className="fill-foreground text-xs font-bold pointer-events-none"
          >
            P
          </text>

          {/* Control panel */}
          <rect
            x={(accessArea.position.x + 2) * scale}
            y={(accessArea.position.y + 0.5) * scale}
            width={scale * 0.8}
            height={scale * 0.5}
            fill="hsl(var(--card))"
            stroke="hsl(var(--foreground))"
            strokeWidth="1"
          />
          <circle
            cx={(accessArea.position.x + 2.2) * scale}
            cy={(accessArea.position.y + 0.7) * scale}
            r="2"
            fill="hsl(var(--chart-1))"
          />
          <circle
            cx={(accessArea.position.x + 2.6) * scale}
            cy={(accessArea.position.y + 0.7) * scale}
            r="2"
            fill="hsl(var(--chart-2))"
          />

          {/* Access walkway */}
          <line
            x1={accessArea.position.x * scale}
            y1={(accessArea.position.y + accessArea.dimensions.width / 2) * scale}
            x2={(accessArea.position.x + accessArea.dimensions.length) * scale}
            y2={(accessArea.position.y + accessArea.dimensions.width / 2) * scale}
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            strokeDasharray="6,4"
            opacity="0.6"
          />
          <line
            x1={(accessArea.position.x + accessArea.dimensions.length / 2) * scale}
            y1={accessArea.position.y * scale}
            x2={(accessArea.position.x + accessArea.dimensions.length / 2) * scale}
            y2={(accessArea.position.y + accessArea.dimensions.width) * scale}
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            strokeDasharray="6,4"
            opacity="0.6"
          />
        </g>
      )}

      {/* Access area label */}
      {visibility.labels && (
        <g>
          <text
            x={(accessArea.position.x + accessArea.dimensions.length / 2) * scale}
            y={(accessArea.position.y + accessArea.dimensions.width + 0.8) * scale}
            textAnchor="middle"
            className="fill-muted-foreground text-sm font-bold pointer-events-none"
          >
            ACESSO/BOMBEAMENTO
          </text>
          <text
            x={(accessArea.position.x + accessArea.dimensions.length / 2) * scale}
            y={(accessArea.position.y + accessArea.dimensions.width + 1.5) * scale}
            textAnchor="middle"
            className="fill-muted-foreground text-xs font-medium pointer-events-none"
          >
            {accessArea.dimensions.length},0m × {accessArea.dimensions.width},0m
          </text>
        </g>
      )}
    </g>
  )
}