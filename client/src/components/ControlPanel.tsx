import { useState } from 'react'
import { Layers, Settings, Download, Eye, EyeOff, Ruler, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LayerVisibility, LayoutSpec, ViewState, MeasurementTool } from '@shared/schema'

interface ControlPanelProps {
  layoutSpec: LayoutSpec
  viewState: ViewState
  measurement: MeasurementTool
  onLayerVisibilityChange: (visibility: LayerVisibility) => void
  onLayoutSpecChange: (spec: Partial<LayoutSpec>) => void
  onMeasurementToggle: () => void
  onExportSVG: () => void
  onExportPNG: () => void
  onPrint: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function ControlPanel({
  layoutSpec,
  viewState,
  measurement,
  onLayerVisibilityChange,
  onLayoutSpecChange,
  onMeasurementToggle,
  onExportSVG,
  onExportPNG,
  onPrint,
  isCollapsed = false,
  onToggleCollapse
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState('layers')

  const layerConfig = [
    { key: 'grid', label: 'Grade', icon: '#', description: 'Linhas de grade e coordenadas' },
    { key: 'boundary', label: 'Contorno', icon: '⬜', description: 'Limites de escavação e canal' },
    { key: 'slope', label: 'Talude', icon: '⟋', description: 'Área de inclinação 1:1,5' },
    { key: 'geomembrane', label: 'Geomembrana', icon: '▤', description: 'HDPE 1,0mm' },
    { key: 'water', label: 'Água', icon: '〰', description: 'Área útil da lagoa' },
    { key: 'pipes', label: 'Tubulações', icon: '━', description: 'DN150/DN200 e caixa' },
    { key: 'access', label: 'Acesso', icon: '▦', description: 'Área de bombeamento' },
    { key: 'dimensions', label: 'Cotas', icon: '↔', description: 'Dimensões e medidas' },
    { key: 'annotations', label: 'Anotações', icon: 'N', description: 'Norte, escala, notas' },
    { key: 'labels', label: 'Rótulos', icon: 'T', description: 'Textos e etiquetas' }
  ]

  const toggleLayer = (layerKey: keyof LayerVisibility) => {
    onLayerVisibilityChange({
      ...layoutSpec.layerVisibility,
      [layerKey]: !layoutSpec.layerVisibility[layerKey]
    })
  }

  const toggleAllLayers = (visible: boolean) => {
    const newVisibility: LayerVisibility = {
      grid: visible,
      boundary: visible,
      slope: visible,
      water: visible,
      geomembrane: visible,
      pipes: visible,
      access: visible,
      dimensions: visible,
      annotations: visible,
      labels: visible
    }
    onLayerVisibilityChange(newVisibility)
  }

  if (isCollapsed) {
    return (
      <Card className="w-16">
        <CardContent className="p-2">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              data-testid="button-expand-controls"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              variant={measurement.isActive ? 'default' : 'ghost'}
              size="icon"
              onClick={onMeasurementToggle}
              data-testid="button-measurement-tool"
            >
              <Ruler className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-96 h-fit max-h-[80vh] overflow-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Controles</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={measurement.isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={onMeasurementToggle}
              data-testid="button-measurement-tool"
            >
              <Ruler className="w-4 h-4 mr-1" />
              Medição
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              data-testid="button-collapse-controls"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layers" data-testid="tab-layers">
              <Layers className="w-4 h-4 mr-1" />
              Camadas
            </TabsTrigger>
            <TabsTrigger value="properties" data-testid="tab-properties">
              <Settings className="w-4 h-4 mr-1" />
              Props
            </TabsTrigger>
            <TabsTrigger value="export" data-testid="tab-export">
              <Download className="w-4 h-4 mr-1" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="layers" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Visibilidade das Camadas</Label>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllLayers(true)}
                  data-testid="button-show-all-layers"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Todas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllLayers(false)}
                  data-testid="button-hide-all-layers"
                >
                  <EyeOff className="w-3 h-3 mr-1" />
                  Nenhuma
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {layerConfig.map((layer) => (
                <div key={layer.key} className="flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-6 border border-border rounded text-center text-xs font-mono flex items-center justify-center">
                      {layer.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm font-medium">{layer.label}</Label>
                      <p className="text-xs text-muted-foreground">{layer.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={layoutSpec.layerVisibility[layer.key as keyof LayerVisibility]}
                    onCheckedChange={() => toggleLayer(layer.key as keyof LayerVisibility)}
                    data-testid={`switch-layer-${layer.key}`}
                  />
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Informações da Vista</Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted rounded p-2">
                  <span className="text-muted-foreground">Zoom:</span>
                  <span className="ml-1 font-mono">{(viewState.zoom * 100).toFixed(0)}%</span>
                </div>
                <div className="bg-muted rounded p-2">
                  <span className="text-muted-foreground">Escala:</span>
                  <span className="ml-1 font-mono">1:{Math.round(100/viewState.zoom)}</span>
                </div>
              </div>
              {measurement.distance && (
                <div className="bg-primary/10 rounded p-2">
                  <span className="text-primary text-sm font-medium">Distância:</span>
                  <span className="ml-1 font-mono text-primary">{measurement.distance.toFixed(2)} m</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-title" className="text-sm font-medium">Título do Projeto</Label>
                <Input
                  id="project-title"
                  value={layoutSpec.title}
                  onChange={(e) => onLayoutSpecChange({ title: e.target.value })}
                  data-testid="input-project-title"
                />
              </div>

              <div>
                <Label htmlFor="project-description" className="text-sm font-medium">Descrição</Label>
                <Input
                  id="project-description"
                  value={layoutSpec.description}
                  onChange={(e) => onLayoutSpecChange({ description: e.target.value })}
                  data-testid="input-project-description"
                />
              </div>

              <div>
                <Label htmlFor="project-scale" className="text-sm font-medium">Escala</Label>
                <Select
                  value={layoutSpec.scale}
                  onValueChange={(value) => onLayoutSpecChange({ scale: value })}
                >
                  <SelectTrigger data-testid="select-project-scale">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Variável">Variável (Zoom)</SelectItem>
                    <SelectItem value="1:50">1:50</SelectItem>
                    <SelectItem value="1:100">1:100</SelectItem>
                    <SelectItem value="1:200">1:200</SelectItem>
                    <SelectItem value="1:500">1:500</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-3 block">Dimensões Totais</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="total-length" className="text-xs text-muted-foreground">Comprimento (m)</Label>
                    <Input
                      id="total-length"
                      type="number"
                      step="0.1"
                      value={layoutSpec.totalDimensions.length}
                      onChange={(e) => onLayoutSpecChange({
                        totalDimensions: {
                          ...layoutSpec.totalDimensions,
                          length: parseFloat(e.target.value) || 0
                        }
                      })}
                      data-testid="input-total-length"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total-width" className="text-xs text-muted-foreground">Largura (m)</Label>
                    <Input
                      id="total-width"
                      type="number"
                      step="0.1"
                      value={layoutSpec.totalDimensions.width}
                      onChange={(e) => onLayoutSpecChange({
                        totalDimensions: {
                          ...layoutSpec.totalDimensions,
                          width: parseFloat(e.target.value) || 0
                        }
                      })}
                      data-testid="input-total-width"
                    />
                  </div>
                </div>
              </div>

              {viewState.selectedComponentId && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium">Componente Selecionado</Label>
                    <div className="mt-2 space-y-2">
                      {(() => {
                        const component = layoutSpec.components.find(c => c.id === viewState.selectedComponentId) ||
                                        layoutSpec.pipes.find(p => p.id === viewState.selectedComponentId);
                        if (!component) return null;
                        
                        return (
                          <div className="bg-muted rounded p-3 space-y-2">
                            <Badge variant="outline">{component.name}</Badge>
                            {'dimensions' in component && (
                              <div className="text-xs space-y-1">
                                <div>
                                  <span className="text-muted-foreground">Dimensões:</span>
                                  <span className="ml-1 font-mono">
                                    {component.dimensions.length} × {component.dimensions.width} m
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Posição:</span>
                                  <span className="ml-1 font-mono">
                                    X: {component.position.x}m, Y: {component.position.y}m
                                  </span>
                                </div>
                              </div>
                            )}
                            {'diameter' in component && (
                              <div className="text-xs">
                                <span className="text-muted-foreground">Diâmetro:</span>
                                <span className="ml-1 font-mono">DN{component.diameter}</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Exportar Desenho</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={onExportSVG}
                    data-testid="button-export-svg"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    SVG
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onExportPNG}
                    data-testid="button-export-png"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PNG
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-3 block">Imprimir</Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onPrint}
                  data-testid="button-print"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Imprimir / PDF
                </Button>
                
                <div className="mt-3 text-xs text-muted-foreground space-y-1">
                  <p>• Formato A4/A3 com bloco de título</p>
                  <p>• Inclui legenda e especificações</p>
                  <p>• Escala preservada para impressão</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-3 block">Informações do Projeto</Label>
                <div className="space-y-2 text-xs">
                  <div className="bg-muted rounded p-2">
                    <span className="text-muted-foreground">Área Total:</span>
                    <span className="ml-1 font-mono">
                      {(layoutSpec.totalDimensions.length * layoutSpec.totalDimensions.width).toFixed(1)} m²
                    </span>
                  </div>
                  {(() => {
                    const usefulArea = layoutSpec.components.find(c => c.type === 'useful_area');
                    return usefulArea && (
                      <div className="bg-muted rounded p-2">
                        <span className="text-muted-foreground">Área Útil:</span>
                        <span className="ml-1 font-mono">
                          {(usefulArea.dimensions.length * usefulArea.dimensions.width).toFixed(1)} m²
                        </span>
                      </div>
                    );
                  })()}
                  <div className="bg-muted rounded p-2">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="ml-1 font-mono">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}