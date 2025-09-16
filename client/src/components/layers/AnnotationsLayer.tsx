import { LayoutSpec, LayerVisibility } from '@shared/schema'

interface AnnotationsLayerProps {
  layoutSpec: LayoutSpec
  scale: number
  svgWidth: number
  svgHeight: number
  visibility: LayerVisibility
}

export default function AnnotationsLayer({ 
  layoutSpec, 
  scale, 
  svgWidth, 
  svgHeight, 
  visibility 
}: AnnotationsLayerProps) {
  if (!visibility.annotations) return null

  return (
    <g className="annotations-layer">
      {/* North arrow */}
      <g transform={`translate(${svgWidth - 60}, 30)`}>
        <circle cx="0" cy="0" r="25" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1"/>
        
        {/* Arrow pointing north */}
        <defs>
          <marker
            id="northArrow"
            markerWidth="12"
            markerHeight="10"
            refX="10"
            refY="5"
            orient="auto"
          >
            <polygon
              points="0 0, 12 5, 0 10"
              fill="hsl(var(--foreground))"
            />
          </marker>
        </defs>
        
        <line
          x1="0"
          y1="10"
          x2="0"
          y2="-10"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          markerEnd="url(#northArrow)"
        />
        
        <text
          x="0"
          y="20"
          textAnchor="middle"
          className="fill-foreground text-xs font-bold"
        >
          N
        </text>
      </g>

      {/* Scale bar */}
      <g transform={`translate(30, ${svgHeight - 40})`}>
        <rect x="-5" y="-15" width="110" height="25" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" rx="3"/>
        
        {/* Scale increments */}
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <rect
                x={i * 15}
                y={0}
                width="15"
                height="8"
                fill={i % 2 === 0 ? 'hsl(var(--foreground))' : 'hsl(var(--background))'}
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />
              <text
                x={i * 15}
                y={-2}
                className="fill-foreground text-xs font-mono"
                textAnchor="middle"
              >
                {i * 2}
              </text>
            </g>
          ))}
        </g>
        
        <text
          x="75"
          y="-5"
          className="fill-foreground text-xs font-bold"
          textAnchor="end"
        >
          metros
        </text>
      </g>

      {/* Project title block */}
      <g transform="translate(30, 30)">
        <rect width="200" height="80" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" rx="4"/>
        
        <text x="10" y="20" className="fill-foreground text-sm font-bold">
          {layoutSpec.title}
        </text>
        <text x="10" y="35" className="fill-muted-foreground text-xs">
          {layoutSpec.description}
        </text>
        <text x="10" y="50" className="fill-muted-foreground text-xs">
          Escala: {layoutSpec.scale}
        </text>
        <text x="10" y="65" className="fill-muted-foreground text-xs">
          Data: {new Date().toLocaleDateString('pt-BR')}
        </text>
      </g>

      {/* Section cut line (A-A) */}
      <g>
        <line
          x1={svgWidth * 0.2}
          y1={svgHeight * 0.15}
          x2={svgWidth * 0.8}
          y2={svgHeight * 0.85}
          stroke="hsl(var(--destructive))"
          strokeWidth="2"
          strokeDasharray="10,5"
        />
        
        {/* Section markers */}
        <circle cx={svgWidth * 0.2} cy={svgHeight * 0.15} r="8" fill="hsl(var(--destructive))" stroke="hsl(var(--background))" strokeWidth="2"/>
        <text x={svgWidth * 0.2} y={svgHeight * 0.15 + 3} textAnchor="middle" className="fill-background text-xs font-bold">A</text>
        
        <circle cx={svgWidth * 0.8} cy={svgHeight * 0.85} r="8" fill="hsl(var(--destructive))" stroke="hsl(var(--background))" strokeWidth="2"/>
        <text x={svgWidth * 0.8} y={svgHeight * 0.85 + 3} textAnchor="middle" className="fill-background text-xs font-bold">A</text>
        
        {/* Section label */}
        <text
          x={svgWidth * 0.5}
          y={svgHeight * 0.5 - 10}
          textAnchor="middle"
          className="fill-destructive text-sm font-bold"
          transform={`rotate(45, ${svgWidth * 0.5}, ${svgHeight * 0.5 - 10})`}
        >
          SEÇÃO A-A
        </text>
      </g>

      {/* Key technical notes */}
      <g transform={`translate(${svgWidth - 220}, ${svgHeight - 100})`}>
        <rect width="180" height="70" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" rx="3"/>
        <text x="10" y="15" className="fill-foreground text-xs font-bold">NOTAS TÉCNICAS:</text>
        <text x="10" y="28" className="fill-muted-foreground text-xs">• Talude com inclinação 1:1,5</text>
        <text x="10" y="40" className="fill-muted-foreground text-xs">• Geomembrana HDPE 1,0mm</text>
        <text x="10" y="52" className="fill-muted-foreground text-xs">• Canal em concreto armado</text>
        <text x="10" y="64" className="fill-muted-foreground text-xs">• Volumes conforme NBR 12209</text>
      </g>

      {/* Coordinate system reference */}
      <g transform="translate(15, 15)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="hsl(var(--foreground))" strokeWidth="1" markerEnd="url(#dimensionArrow)"/>
        <line x1="0" y1="0" x2="0" y2="20" stroke="hsl(var(--foreground))" strokeWidth="1" markerEnd="url(#dimensionArrow)"/>
        <text x="22" y="3" className="fill-foreground text-xs font-bold">X</text>
        <text x="3" y="25" className="fill-foreground text-xs font-bold">Y</text>
      </g>
    </g>
  )
}