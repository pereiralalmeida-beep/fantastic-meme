import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LegendItem {
  id: string
  name: string
  color: string
  pattern?: string
  description: string
  dimensions?: string
}

interface LegendPanelProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function LegendPanel({ isCollapsed = false, onToggle }: LegendPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['components', 'infrastructure']))

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const legendData = {
    components: [
      {
        id: 'excavation',
        name: 'Limite da Escavação',
        color: 'hsl(var(--chart-1))',
        description: 'Perímetro total da área escavada',
        dimensions: '22,0m × 19,0m'
      },
      {
        id: 'slope',
        name: 'Talude 1:1,5',
        color: 'hsl(var(--chart-3))',
        description: 'Área de inclinação do talude',
        dimensions: 'Inclinação 1:1,5'
      },
      {
        id: 'useful-area',
        name: 'Área Útil da Lagoa',
        color: 'hsl(var(--chart-2))',
        pattern: 'water',
        description: 'Área útil para armazenamento de água',
        dimensions: '13,0m × 10,0m'
      },
      {
        id: 'geomembrane',
        name: 'Geomembrana HDPE',
        color: 'hsl(var(--chart-1))',
        description: 'Impermeabilização HDPE 1.0mm',
        dimensions: 'Espessura: 1,0mm'
      },
      {
        id: 'concrete-channel',
        name: 'Canal de Coroamento',
        color: 'hsl(var(--muted-foreground))',
        pattern: 'concrete',
        description: 'Canal perimetral em concreto',
        dimensions: 'Concreto'
      }
    ],
    infrastructure: [
      {
        id: 'inlet-pipe',
        name: 'Tubulação de Entrada',
        color: 'hsl(var(--chart-3))',
        description: 'Tubulação de entrada de água',
        dimensions: 'DN150'
      },
      {
        id: 'outlet-pipe',
        name: 'Tubulação de Extravasor',
        color: 'hsl(var(--chart-4))',
        description: 'Tubulação de saída/extravasor',
        dimensions: 'DN200'
      },
      {
        id: 'sedimentation-box',
        name: 'Caixa de Decantação',
        color: 'hsl(var(--foreground))',
        description: 'Caixa para decantação de sólidos',
        dimensions: '1,0m × 1,0m'
      },
      {
        id: 'access-area',
        name: 'Área de Acesso/Bombeamento',
        color: 'hsl(var(--muted-foreground))',
        description: 'Área para acesso e equipamentos',
        dimensions: '3,0m × 3,0m'
      }
    ]
  }

  if (isCollapsed) {
    return (
      <div className="w-12 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="w-10 h-10"
          data-testid="button-expand-legend"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-80 h-fit max-h-full overflow-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Legenda</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-8 h-8"
            data-testid="button-collapse-legend"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Components Section */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start p-0 h-auto font-medium"
            onClick={() => toggleSection('components')}
            data-testid="button-toggle-components"
          >
            {expandedSections.has('components') ? (
              <ChevronDown className="w-4 h-4 mr-2" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
            Componentes Principais
          </Button>
          
          {expandedSections.has('components') && (
            <div className="mt-3 space-y-3 ml-6">
              {legendData.components.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-sm border border-border flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {item.name}
                      </p>
                      {item.dimensions && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.dimensions}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infrastructure Section */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start p-0 h-auto font-medium"
            onClick={() => toggleSection('infrastructure')}
            data-testid="button-toggle-infrastructure"
          >
            {expandedSections.has('infrastructure') ? (
              <ChevronDown className="w-4 h-4 mr-2" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2" />
            )}
            Infraestrutura
          </Button>
          
          {expandedSections.has('infrastructure') && (
            <div className="mt-3 space-y-3 ml-6">
              {legendData.infrastructure.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-sm border border-border flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {item.name}
                      </p>
                      {item.dimensions && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.dimensions}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technical Info */}
        <div className="pt-4 border-t border-border">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Informações Técnicas</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Vista Superior - Planta Baixa</p>
              <p>• Escala: Variável (zoom)</p>
              <p>• Unidades: metros (m)</p>
              <p>• Tipo: Lagoa de Tratamento</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}