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

      {/* Chain dimensions (partial lengths) - Technical Engineering Style */}
      <g opacity="0.8">
        {/* Horizontal chain dimensions */}
        {usefulArea && (
          <g>
            {/* Distance from left edge to useful area */}
            <line
              x1={0}
              y1={-15}
              x2={usefulArea.position.x * scale}
              y2={-15}
              stroke="hsl(var(--chart-3))"
              strokeWidth="0.8"
              strokeDasharray="3,2"
            />
            <text
              x={(usefulArea.position.x / 2) * scale}
              y={-20}
              textAnchor="middle"
              className="fill-chart-3 text-xs font-mono font-bold"
            >
              {usefulArea.position.x.toFixed(1)}
            </text>
            
            {/* Useful area length (internal) */}
            <line
              x1={usefulArea.position.x * scale}
              y1={-15}
              x2={(usefulArea.position.x + usefulArea.dimensions.length) * scale}
              y2={-15}
              stroke="hsl(var(--chart-2))"
              strokeWidth="1.2"
            />
            <text
              x={(usefulArea.position.x + usefulArea.dimensions.length / 2) * scale}
              y={-20}
              textAnchor="middle"
              className="fill-chart-2 text-xs font-mono font-bold"
            >
              {usefulArea.dimensions.length.toFixed(1)}
            </text>
            
            {/* Distance from useful area to right edge */}
            <line
              x1={(usefulArea.position.x + usefulArea.dimensions.length) * scale}
              y1={-15}
              x2={svgWidth}
              y2={-15}
              stroke="hsl(var(--chart-3))"
              strokeWidth="0.8"
              strokeDasharray="3,2"
            />
            <text
              x={(usefulArea.position.x + usefulArea.dimensions.length + (layoutSpec.totalDimensions.length - usefulArea.position.x - usefulArea.dimensions.length) / 2) * scale}
              y={-20}
              textAnchor="middle"
              className="fill-chart-3 text-xs font-mono font-bold"
            >
              {(layoutSpec.totalDimensions.length - usefulArea.position.x - usefulArea.dimensions.length).toFixed(1)}
            </text>
          </g>
        )}
        
        {/* Vertical chain dimensions */}
        {usefulArea && (
          <g>
            {/* Distance from top edge to useful area */}
            <line
              x1={-35}
              y1={0}
              x2={-35}
              y2={usefulArea.position.y * scale}
              stroke="hsl(var(--chart-3))"
              strokeWidth="0.8"
              strokeDasharray="3,2"
            />
            <text
              x={-45}
              y={(usefulArea.position.y / 2) * scale}
              textAnchor="middle"
              className="fill-chart-3 text-xs font-mono font-bold"
              transform={`rotate(-90, -45, ${(usefulArea.position.y / 2) * scale})`}
            >
              {usefulArea.position.y.toFixed(1)}
            </text>
            
            {/* Useful area width (internal) */}
            <line
              x1={-35}
              y1={usefulArea.position.y * scale}
              x2={-35}
              y2={(usefulArea.position.y + usefulArea.dimensions.width) * scale}
              stroke="hsl(var(--chart-2))"
              strokeWidth="1.2"
            />
            <text
              x={-45}
              y={(usefulArea.position.y + usefulArea.dimensions.width / 2) * scale}
              textAnchor="middle"
              className="fill-chart-2 text-xs font-mono font-bold"
              transform={`rotate(-90, -45, ${(usefulArea.position.y + usefulArea.dimensions.width / 2) * scale})`}
            >
              {usefulArea.dimensions.width.toFixed(1)}
            </text>
            
            {/* Distance from useful area to bottom edge */}
            <line
              x1={-35}
              y1={(usefulArea.position.y + usefulArea.dimensions.width) * scale}
              x2={-35}
              y2={svgHeight}
              stroke="hsl(var(--chart-3))"
              strokeWidth="0.8"
              strokeDasharray="3,2"
            />
            <text
              x={-45}
              y={(usefulArea.position.y + usefulArea.dimensions.width + (layoutSpec.totalDimensions.width - usefulArea.position.y - usefulArea.dimensions.width) / 2) * scale}
              textAnchor="middle"
              className="fill-chart-3 text-xs font-mono font-bold"
              transform={`rotate(-90, -45, ${(usefulArea.position.y + usefulArea.dimensions.width + (layoutSpec.totalDimensions.width - usefulArea.position.y - usefulArea.dimensions.width) / 2) * scale})`}
            >
              {(layoutSpec.totalDimensions.width - usefulArea.position.y - usefulArea.dimensions.width).toFixed(1)}
            </text>
          </g>
        )}
      </g>
      
      {/* Extension lines for chain dimensions */}
      <g stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.6">
        {usefulArea && (
          <>
            {/* Horizontal extension lines */}
            <line x1={usefulArea.position.x * scale} y1={0} x2={usefulArea.position.x * scale} y2={-25} />
            <line x1={(usefulArea.position.x + usefulArea.dimensions.length) * scale} y1={0} x2={(usefulArea.position.x + usefulArea.dimensions.length) * scale} y2={-25} />
            
            {/* Vertical extension lines */}
            <line x1={0} y1={usefulArea.position.y * scale} x2={-45} y2={usefulArea.position.y * scale} />
            <line x1={0} y1={(usefulArea.position.y + usefulArea.dimensions.width) * scale} x2={-45} y2={(usefulArea.position.y + usefulArea.dimensions.width) * scale} />
          </>
        )}
      </g>
      
      {/* Enhanced tick marks with coordinate labels */}
      <g className="coordinate-ticks">
        {/* Major tick marks for total length with coordinates */}
        {Array.from({ length: Math.ceil(layoutSpec.totalDimensions.length) + 1 }, (_, i) => {
          const x = i * scale
          const isMainTick = i % 5 === 0
          return (
            <g key={`tick-h-${i}`}>
              <line
                x1={x}
                y1={svgHeight + (isMainTick ? 15 : 20)}
                x2={x}
                y2={svgHeight + 30}
                stroke="hsl(var(--foreground))"
                strokeWidth={isMainTick ? "1.5" : "0.8"}
              />
              {isMainTick && (
                <text
                  x={x}
                  y={svgHeight + 50}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-mono"
                >
                  {i}m
                </text>
              )}
            </g>
          )
        })}

        {/* Major tick marks for total width with coordinates */}
        {Array.from({ length: Math.ceil(layoutSpec.totalDimensions.width) + 1 }, (_, i) => {
          const y = i * scale
          const isMainTick = i % 5 === 0
          return (
            <g key={`tick-v-${i}`}>
              <line
                x1={isMainTick ? -35 : -30}
                y1={y}
                x2={-20}
                y2={y}
                stroke="hsl(var(--foreground))"
                strokeWidth={isMainTick ? "1.5" : "0.8"}
              />
              {isMainTick && (
                <text
                  x={-50}
                  y={y + 3}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-mono"
                >
                  {i}m
                </text>
              )}
            </g>
          )
        })}
      </g>
    </g>
  )
}