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
      {/* Professional North arrow */}
      <g transform={`translate(${svgWidth - 70}, 40)`}>
        {/* Outer compass ring */}
        <circle cx="0" cy="0" r="30" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
        <circle cx="0" cy="0" r="25" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="2,1"/>
        
        {/* Cardinal directions */}
        <g className="cardinal-marks">
          {['N', 'E', 'S', 'W'].map((dir, i) => {
            const angle = i * 90
            const radius = 20
            const x = Math.sin((angle * Math.PI) / 180) * radius
            const y = -Math.cos((angle * Math.PI) / 180) * radius
            return (
              <text
                key={dir}
                x={x}
                y={y + 3}
                textAnchor="middle"
                className={`${dir === 'N' ? 'fill-primary text-sm font-bold' : 'fill-muted-foreground text-xs'}`}
              >
                {dir}
              </text>
            )
          })}
        </g>
        
        {/* North arrow - enhanced */}
        <defs>
          <marker
            id="northArrowHead"
            markerWidth="16"
            markerHeight="12"
            refX="14"
            refY="6"
            orient="auto"
          >
            <polygon
              points="0 0, 16 6, 0 12, 4 6"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="0.5"
            />
          </marker>
        </defs>
        
        {/* Main north arrow */}
        <line
          x1="0"
          y1="12"
          x2="0"
          y2="-12"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          markerEnd="url(#northArrowHead)"
        />
        
        {/* Compass rose decoration */}
        <g stroke="hsl(var(--muted-foreground))" strokeWidth="0.5">
          {Array.from({ length: 8 }, (_, i) => {
            const angle = i * 45
            const innerRadius = i % 2 === 0 ? 15 : 10
            const outerRadius = 22
            const x1 = Math.sin((angle * Math.PI) / 180) * innerRadius
            const y1 = -Math.cos((angle * Math.PI) / 180) * innerRadius
            const x2 = Math.sin((angle * Math.PI) / 180) * outerRadius
            const y2 = -Math.cos((angle * Math.PI) / 180) * outerRadius
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
            )
          })}
        </g>
        
        {/* Center dot */}
        <circle cx="0" cy="0" r="2" fill="hsl(var(--primary))"/>
      </g>

      {/* Professional scale bar */}
      <g transform={`translate(40, ${svgHeight - 50})`}>
        <rect x="-10" y="-20" width="200" height="35" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" rx="4"/>
        
        {/* Scale title */}
        <text x="90" y="-5" textAnchor="middle" className="fill-foreground text-sm font-bold">
          ESCALA GRÁFICA
        </text>
        
        {/* Main scale bar */}
        <g transform="translate(10, 2)">
          {/* Primary increments (meters) */}
          {Array.from({ length: 11 }, (_, i) => {
            const width = 15
            const isMainTick = i % 5 === 0
            return (
              <g key={i}>
                <rect
                  x={i * width}
                  y={0}
                  width={width}
                  height={isMainTick ? "10" : "8"}
                  fill={i % 2 === 0 ? 'hsl(var(--foreground))' : 'hsl(var(--background))'}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                />
                {isMainTick && (
                  <text
                    x={i * width}
                    y={-3}
                    className="fill-foreground text-xs font-mono font-bold"
                    textAnchor="middle"
                  >
                    {i}
                  </text>
                )}
              </g>
            )
          })}
          
          {/* Scale labels */}
          <text x="80" y="-8" textAnchor="middle" className="fill-muted-foreground text-xs">
            metros
          </text>
          <text x="170" y="6" className="fill-muted-foreground text-xs font-mono">
            0────5────10m
          </text>
        </g>
        
        {/* Secondary scale (half increments) */}
        <g transform="translate(10, 12)">
          {Array.from({ length: 21 }, (_, i) => {
            const width = 7.5
            return (
              <rect
                key={i}
                x={i * width}
                y={0}
                width={width}
                height="4"
                fill={i % 2 === 0 ? 'hsl(var(--muted))' : 'hsl(var(--muted-foreground))'}
                stroke="none"
              />
            )
          })}
          <text x="80" y="-2" textAnchor="middle" className="fill-muted-foreground text-xs">
            subdivisões 0,5m
          </text>
        </g>
      </g>

      {/* Enhanced project title block */}
      <g transform="translate(40, 40)">
        <rect width="280" height="100" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" rx="6"/>
        <rect x="2" y="2" width="276" height="96" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" rx="4"/>
        
        {/* Header bar */}
        <rect x="0" y="0" width="280" height="25" fill="hsl(var(--primary))" rx="6 6 0 0"/>
        <text x="140" y="17" textAnchor="middle" className="fill-primary-foreground text-sm font-bold">
          PROJETO TÉCNICO
        </text>
        
        {/* Project information */}
        <text x="15" y="45" className="fill-foreground text-base font-bold">
          {layoutSpec.title}
        </text>
        <text x="15" y="62" className="fill-muted-foreground text-sm">
          {layoutSpec.description}
        </text>
        <text x="15" y="78" className="fill-muted-foreground text-xs">
          Escala: {layoutSpec.scale} | Data: {new Date().toLocaleDateString('pt-BR')}
        </text>
        <text x="15" y="92" className="fill-muted-foreground text-xs">
          Área Total: {(layoutSpec.totalDimensions.length * layoutSpec.totalDimensions.width).toFixed(1)} m²
        </text>
        
        {/* Professional seal area */}
        <circle cx="240" cy="70" r="20" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="240" y="73" textAnchor="middle" className="fill-muted-foreground text-xs">
          ART
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