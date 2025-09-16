import { LayerVisibility } from '@shared/schema'

interface GridLayerProps {
  svgWidth: number
  svgHeight: number
  scale: number
  maxLength: number
  maxWidth: number
  visibility: LayerVisibility
}

export default function GridLayer({ 
  svgWidth, 
  svgHeight, 
  scale, 
  maxLength, 
  maxWidth, 
  visibility 
}: GridLayerProps) {
  if (!visibility.grid) return null

  return (
    <g className="grid-layer" opacity="0.3">
      {/* Vertical grid lines */}
      {Array.from({ length: Math.ceil(maxLength) + 1 }, (_, i) => (
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
      
      {/* Horizontal grid lines */}
      {Array.from({ length: Math.ceil(maxWidth) + 1 }, (_, i) => (
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
      
      {/* Grid labels every 5 meters */}
      {visibility.labels && (
        <>
          {Array.from({ length: Math.ceil(maxLength / 5) + 1 }, (_, i) => (
            <text
              key={`label-v-${i}`}
              x={i * 5 * scale}
              y={-5}
              textAnchor="middle"
              className="fill-muted-foreground text-xs font-mono"
            >
              {i * 5}m
            </text>
          ))}
          
          {Array.from({ length: Math.ceil(maxWidth / 5) + 1 }, (_, i) => (
            <text
              key={`label-h-${i}`}
              x={-15}
              y={i * 5 * scale + 4}
              textAnchor="middle"
              className="fill-muted-foreground text-xs font-mono"
            >
              {i * 5}m
            </text>
          ))}
        </>
      )}
    </g>
  )
}