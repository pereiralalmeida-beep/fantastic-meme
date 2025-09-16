import { ComponentSpec, LayerVisibility } from '@shared/schema'

interface BoundaryLayerProps {
  components: ComponentSpec[]
  scale: number
  visibility: LayerVisibility
  selectedId?: string
  onComponentClick?: (id: string) => void
  onComponentHover?: (id: string | null) => void
}

export default function BoundaryLayer({ 
  components, 
  scale, 
  visibility, 
  selectedId,
  onComponentClick,
  onComponentHover 
}: BoundaryLayerProps) {
  if (!visibility.boundary) return null

  const excavation = components.find(c => c.type === 'excavation')
  const concreteChannel = components.find(c => c.type === 'concrete_channel')

  if (!excavation) return null

  return (
    <g className="boundary-layer">
      {/* Excavation boundary */}
      <rect
        x={excavation.position.x * scale}
        y={excavation.position.y * scale}
        width={excavation.dimensions.length * scale}
        height={excavation.dimensions.width * scale}
        fill="none"
        stroke="hsl(var(--chart-1))"
        strokeWidth="3"
        strokeDasharray="8,4"
        className={`transition-all duration-200 ${
          selectedId === excavation.id ? 'stroke-[4] drop-shadow-lg' : ''
        } hover-elevate cursor-pointer`}
        onClick={() => onComponentClick?.(excavation.id)}
        onMouseEnter={() => onComponentHover?.(excavation.id)}
        onMouseLeave={() => onComponentHover?.(null)}
        data-testid={`component-${excavation.id}`}
      />

      {/* Concrete channel perimeter */}
      {concreteChannel && (
        <rect
          x={concreteChannel.position.x * scale}
          y={concreteChannel.position.y * scale}
          width={concreteChannel.dimensions.length * scale}
          height={concreteChannel.dimensions.width * scale}
          fill="url(#concrete)"
          fillOpacity="0.4"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
          className={`transition-all duration-200 ${
            selectedId === concreteChannel.id ? 'stroke-[2.5] drop-shadow-lg' : ''
          } hover-elevate cursor-pointer`}
          onClick={() => onComponentClick?.(concreteChannel.id)}
          onMouseEnter={() => onComponentHover?.(concreteChannel.id)}
          onMouseLeave={() => onComponentHover?.(null)}
          data-testid={`component-${concreteChannel.id}`}
        />
      )}

      {/* Component labels */}
      {visibility.labels && (
        <>
          <text
            x={(excavation.position.x * scale) + (excavation.dimensions.length * scale / 2)}
            y={(excavation.position.y * scale) - 10}
            textAnchor="middle"
            className="fill-chart-1 text-sm font-medium pointer-events-none"
          >
            {excavation.name}
          </text>
          
          {concreteChannel && (
            <text
              x={(concreteChannel.position.x * scale) + 10}
              y={(concreteChannel.position.y * scale) + 15}
              className="fill-muted-foreground text-xs font-medium pointer-events-none"
            >
              {concreteChannel.name}
            </text>
          )}
        </>
      )}
    </g>
  )
}