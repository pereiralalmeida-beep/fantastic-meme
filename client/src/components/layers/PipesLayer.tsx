import { PipeSpec, ComponentSpec, LayerVisibility } from '@shared/schema'

interface PipesLayerProps {
  pipes: PipeSpec[]
  components: ComponentSpec[]
  scale: number
  visibility: LayerVisibility
  selectedId?: string
  onPipeClick?: (id: string) => void
  onPipeHover?: (id: string | null) => void
}

export default function PipesLayer({ 
  pipes, 
  components,
  scale, 
  visibility, 
  selectedId,
  onPipeClick,
  onPipeHover 
}: PipesLayerProps) {
  if (!visibility.pipes) return null

  const sedimentationBox = components.find(c => c.type === 'sedimentation_box')

  return (
    <g className="pipes-layer">
      {pipes.map((pipe) => {
        const strokeWidth = pipe.diameter / 25 // Scale stroke width based on diameter
        const pipeColor = pipe.type === 'entrada' ? 'hsl(var(--chart-3))' : 
                         pipe.type === 'extravasor' ? 'hsl(var(--chart-4))' : 
                         'hsl(var(--chart-5))'
        
        return (
          <g key={pipe.id}>
            {/* Pipe line */}
            <line
              x1={pipe.direction === 'horizontal' ? 0 : pipe.position.x * scale}
              y1={pipe.direction === 'horizontal' ? pipe.position.y * scale : 0}
              x2={pipe.direction === 'horizontal' ? (pipe.position.x + 4) * scale : pipe.position.x * scale}
              y2={pipe.direction === 'horizontal' ? pipe.position.y * scale : (pipe.position.y + 4) * scale}
              stroke={pipeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className={`transition-all duration-200 ${
                selectedId === pipe.id ? 'drop-shadow-lg opacity-100' : 'opacity-90'
              } hover-elevate cursor-pointer`}
              onClick={() => onPipeClick?.(pipe.id)}
              onMouseEnter={() => onPipeHover?.(pipe.id)}
              onMouseLeave={() => onPipeHover?.(null)}
              data-testid={`pipe-${pipe.id}`}
            />

            {/* Pipe arrows indicating flow direction */}
            {visibility.annotations && (
              <g>
                <defs>
                  <marker
                    id={`pipeArrow-${pipe.id}`}
                    markerWidth="10"
                    markerHeight="8"
                    refX="8"
                    refY="4"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 4, 0 8"
                      fill={pipeColor}
                      opacity="0.8"
                    />
                  </marker>
                </defs>
                
                <line
                  x1={pipe.direction === 'horizontal' ? (pipe.position.x + 1) * scale : pipe.position.x * scale}
                  y1={pipe.direction === 'horizontal' ? pipe.position.y * scale : (pipe.position.y + 1) * scale}
                  x2={pipe.direction === 'horizontal' ? (pipe.position.x + 3) * scale : pipe.position.x * scale}
                  y2={pipe.direction === 'horizontal' ? pipe.position.y * scale : (pipe.position.y + 3) * scale}
                  stroke={pipeColor}
                  strokeWidth="2"
                  markerEnd={`url(#pipeArrow-${pipe.id})`}
                  opacity="0.7"
                />
              </g>
            )}

            {/* Pipe label */}
            {visibility.labels && (
              <text
                x={pipe.direction === 'horizontal' ? (pipe.position.x + 2) * scale : (pipe.position.x + 1) * scale}
                y={pipe.direction === 'horizontal' ? (pipe.position.y - 1) * scale : (pipe.position.y + 2) * scale}
                textAnchor="middle"
                className="fill-foreground text-sm font-bold pointer-events-none"
                style={{ fill: pipeColor }}
              >
                DN{pipe.diameter}
              </text>
            )}

            {/* Connection points */}
            <circle
              cx={pipe.direction === 'horizontal' ? 0 : pipe.position.x * scale}
              cy={pipe.direction === 'horizontal' ? pipe.position.y * scale : 0}
              r="4"
              fill={pipeColor}
              stroke="hsl(var(--background))"
              strokeWidth="2"
            />
            
            <circle
              cx={pipe.direction === 'horizontal' ? (pipe.position.x + 4) * scale : pipe.position.x * scale}
              cy={pipe.direction === 'horizontal' ? pipe.position.y * scale : (pipe.position.y + 4) * scale}
              r="4"
              fill={pipeColor}
              stroke="hsl(var(--background))"
              strokeWidth="2"
            />
          </g>
        )
      })}

      {/* Sedimentation Box */}
      {sedimentationBox && (
        <g>
          <rect
            x={sedimentationBox.position.x * scale}
            y={sedimentationBox.position.y * scale}
            width={sedimentationBox.dimensions.length * scale}
            height={sedimentationBox.dimensions.width * scale}
            fill="hsl(var(--card))"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            className={`transition-all duration-200 ${
              selectedId === sedimentationBox.id ? 'stroke-[3] drop-shadow-lg' : ''
            } hover-elevate cursor-pointer`}
            onClick={() => onPipeClick?.(sedimentationBox.id)}
            onMouseEnter={() => onPipeHover?.(sedimentationBox.id)}
            onMouseLeave={() => onPipeHover?.(null)}
            data-testid={`component-${sedimentationBox.id}`}
          />

          {/* Sedimentation Box internal details */}
          {visibility.annotations && (
            <g>
              {/* Internal baffles */}
              <line
                x1={(sedimentationBox.position.x + 0.3) * scale}
                y1={sedimentationBox.position.y * scale}
                x2={(sedimentationBox.position.x + 0.3) * scale}
                y2={(sedimentationBox.position.y + sedimentationBox.dimensions.width) * scale}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                opacity="0.7"
              />
              <line
                x1={(sedimentationBox.position.x + 0.7) * scale}
                y1={sedimentationBox.position.y * scale}
                x2={(sedimentationBox.position.x + 0.7) * scale}
                y2={(sedimentationBox.position.y + sedimentationBox.dimensions.width) * scale}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                opacity="0.7"
              />
            </g>
          )}

          {visibility.labels && (
            <text
              x={(sedimentationBox.position.x + sedimentationBox.dimensions.length / 2) * scale}
              y={(sedimentationBox.position.y + sedimentationBox.dimensions.width / 2 + 0.2) * scale}
              textAnchor="middle"
              className="fill-foreground text-xs font-bold pointer-events-none"
            >
              CAIXA
            </text>
          )}
        </g>
      )}
    </g>
  )
}