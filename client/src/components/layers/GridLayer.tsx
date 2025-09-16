import { LayoutSpec, LayerVisibility } from '@shared/schema'

interface GridLayerProps {
  svgWidth: number
  svgHeight: number
  scale: number
  maxLength: number
  maxWidth: number
  layoutSpec: LayoutSpec
  visibility: LayerVisibility
}

export default function GridLayer({ 
  svgWidth, 
  svgHeight, 
  scale, 
  maxLength, 
  maxWidth, 
  layoutSpec,
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
      
      {/* Enhanced grid labels and coordinate system */}
      {visibility.labels && (
        <g className="grid-labels">
          {/* X-axis coordinate labels */}
          {Array.from({ length: Math.ceil(layoutSpec.totalDimensions.length) + 1 }, (_, i) => {
            const isMainCoord = i % 5 === 0
            const x = i * scale
            return (
              <g key={`x-coord-${i}`}>
                {isMainCoord && (
                  <>
                    <text
                      x={x}
                      y={-8}
                      textAnchor="middle"
                      className="fill-foreground text-xs font-mono font-bold"
                    >
                      {i}m
                    </text>
                    {/* Major coordinate line */}
                    <line
                      x1={x}
                      y1={-4}
                      x2={x}
                      y2={svgHeight + 4}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="0.5"
                      strokeDasharray="4,4"
                      opacity="0.8"
                    />
                  </>
                )}
                {!isMainCoord && i > 0 && (
                  <text
                    x={x}
                    y={-5}
                    textAnchor="middle"
                    className="fill-muted-foreground text-xs font-mono"
                  >
                    {i}
                  </text>
                )}
              </g>
            )
          })}
          
          {/* Y-axis coordinate labels */}
          {Array.from({ length: Math.ceil(layoutSpec.totalDimensions.width) + 1 }, (_, i) => {
            const isMainCoord = i % 5 === 0
            const y = i * scale
            return (
              <g key={`y-coord-${i}`}>
                {isMainCoord && (
                  <>
                    <text
                      x={-10}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-foreground text-xs font-mono font-bold"
                    >
                      {i}m
                    </text>
                    {/* Major coordinate line */}
                    <line
                      x1={-4}
                      y1={y}
                      x2={svgWidth + 4}
                      y2={y}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="0.5"
                      strokeDasharray="4,4"
                      opacity="0.8"
                    />
                  </>
                )}
                {!isMainCoord && i > 0 && (
                  <text
                    x={-7}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-muted-foreground text-xs font-mono"
                  >
                    {i}
                  </text>
                )}
              </g>
            )
          })}
          
          {/* Coordinate origin marker */}
          <g transform="translate(0, 0)">
            <circle cx="0" cy="0" r="3" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="1"/>
            <text x="8" y="-8" className="fill-primary text-xs font-bold">
              (0,0)
            </text>
          </g>
          
          {/* Grid reference note */}
          <g transform={`translate(${svgWidth - 120}, 15)`}>
            <rect x="-5" y="-12" width="120" height="20" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="0.5" rx="2" fillOpacity="0.9"/>
            <text x="55" y="-2" textAnchor="middle" className="fill-muted-foreground text-xs">
              Grade: 1m × 1m
            </text>
          </g>
        </g>
      )}
    </g>
  )
}