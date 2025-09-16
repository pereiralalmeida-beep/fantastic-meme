import { LayoutSpec, LayerVisibility } from '@shared/schema'

interface DimensionsLayerProps {
  layoutSpec: LayoutSpec
  scale: number
  svgWidth: number
  svgHeight: number
  visibility: LayerVisibility
}

export default function DimensionsLayer({ 
  layoutSpec, 
  scale, 
  svgWidth, 
  svgHeight, 
  visibility 
}: DimensionsLayerProps) {
  if (!visibility.dimensions) return null

  const usefulArea = layoutSpec.components.find(c => c.type === 'useful_area')
  const accessArea = layoutSpec.components.find(c => c.type === 'access_area')

  return (
    <g className="dimensions-layer">
      {/* Arrow markers */}
      <defs>
        <marker
          id="dimensionArrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="hsl(var(--foreground))"
          />
        </marker>
      </defs>

      {/* Overall dimensions */}
      <g>
        {/* Total length dimension */}
        <line
          x1={0}
          y1={svgHeight + 25}
          x2={svgWidth}
          y2={svgHeight + 25}
          stroke="hsl(var(--foreground))"
          strokeWidth="1"
          markerStart="url(#dimensionArrow)"
          markerEnd="url(#dimensionArrow)"
        />
        <text
          x={svgWidth / 2}
          y={svgHeight + 40}
          textAnchor="middle"
          className="fill-foreground text-sm font-mono font-bold"
        >
          {layoutSpec.totalDimensions.length.toFixed(1)} m
        </text>

        {/* Total width dimension */}
        <line
          x1={-25}
          y1={0}
          x2={-25}
          y2={svgHeight}
          stroke="hsl(var(--foreground))"
          strokeWidth="1"
          markerStart="url(#dimensionArrow)"
          markerEnd="url(#dimensionArrow)"
        />
        <text
          x={-40}
          y={svgHeight / 2}
          textAnchor="middle"
          className="fill-foreground text-sm font-mono font-bold"
          transform={`rotate(-90, -40, ${svgHeight / 2})`}
        >
          {layoutSpec.totalDimensions.width.toFixed(1)} m
        </text>
      </g>

      {/* Useful area dimensions */}
      {usefulArea && (
        <g>
          {/* Useful area length */}
          <line
            x1={usefulArea.position.x * scale}
            y1={(usefulArea.position.y + usefulArea.dimensions.width + 1.5) * scale}
            x2={(usefulArea.position.x + usefulArea.dimensions.length) * scale}
            y2={(usefulArea.position.y + usefulArea.dimensions.width + 1.5) * scale}
            stroke="hsl(var(--chart-2))"
            strokeWidth="1"
            markerStart="url(#dimensionArrow)"
            markerEnd="url(#dimensionArrow)"
          />
          <text
            x={(usefulArea.position.x + usefulArea.dimensions.length / 2) * scale}
            y={(usefulArea.position.y + usefulArea.dimensions.width + 2.5) * scale}
            textAnchor="middle"
            className="fill-chart-2 text-xs font-mono font-bold"
          >
            {usefulArea.dimensions.length.toFixed(1)} m
          </text>

          {/* Useful area width */}
          <line
            x1={(usefulArea.position.x - 1.5) * scale}
            y1={usefulArea.position.y * scale}
            x2={(usefulArea.position.x - 1.5) * scale}
            y2={(usefulArea.position.y + usefulArea.dimensions.width) * scale}
            stroke="hsl(var(--chart-2))"
            strokeWidth="1"
            markerStart="url(#dimensionArrow)"
            markerEnd="url(#dimensionArrow)"
          />
          <text
            x={(usefulArea.position.x - 2.5) * scale}
            y={(usefulArea.position.y + usefulArea.dimensions.width / 2) * scale}
            textAnchor="middle"
            className="fill-chart-2 text-xs font-mono font-bold"
            transform={`rotate(-90, ${(usefulArea.position.x - 2.5) * scale}, ${(usefulArea.position.y + usefulArea.dimensions.width / 2) * scale})`}
          >
            {usefulArea.dimensions.width.toFixed(1)} m
          </text>
        </g>
      )}

      {/* Access area dimensions */}
      {accessArea && (
        <g>
          <line
            x1={accessArea.position.x * scale}
            y1={(accessArea.position.y - 0.8) * scale}
            x2={(accessArea.position.x + accessArea.dimensions.length) * scale}
            y2={(accessArea.position.y - 0.8) * scale}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="0.8"
            markerStart="url(#dimensionArrow)"
            markerEnd="url(#dimensionArrow)"
          />
          <text
            x={(accessArea.position.x + accessArea.dimensions.length / 2) * scale}
            y={(accessArea.position.y - 1.2) * scale}
            textAnchor="middle"
            className="fill-muted-foreground text-xs font-mono"
          >
            {accessArea.dimensions.length.toFixed(1)} m
          </text>
        </g>
      )}

      {/* Tick marks on dimension lines */}
      <g>
        {/* Tick marks for total length */}
        {Array.from({ length: 5 }, (_, i) => {
          const x = (i * layoutSpec.totalDimensions.length / 4) * scale
          return (
            <line
              key={`tick-h-${i}`}
              x1={x}
              y1={svgHeight + 20}
              x2={x}
              y2={svgHeight + 30}
              stroke="hsl(var(--foreground))"
              strokeWidth="1"
            />
          )
        })}

        {/* Tick marks for total width */}
        {Array.from({ length: 5 }, (_, i) => {
          const y = (i * layoutSpec.totalDimensions.width / 4) * scale
          return (
            <line
              key={`tick-v-${i}`}
              x1={-30}
              y1={y}
              x2={-20}
              y2={y}
              stroke="hsl(var(--foreground))"
              strokeWidth="1"
            />
          )
        })}
      </g>

      {/* Chain dimensions (partial lengths) */}
      <g opacity="0.7">
        {/* Show some intermediate dimensions */}
        {usefulArea && (
          <g>
            {/* Distance from edge to useful area */}
            <line
              x1={0}
              y1={-15}
              x2={usefulArea.position.x * scale}
              y2={-15}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
            <text
              x={(usefulArea.position.x / 2) * scale}
              y={-18}
              textAnchor="middle"
              className="fill-muted-foreground text-xs font-mono"
            >
              {usefulArea.position.x.toFixed(1)}
            </text>
          </g>
        )}
      </g>
    </g>
  )
}