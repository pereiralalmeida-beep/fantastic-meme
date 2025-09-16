import { useState, useCallback } from 'react'
import TechnicalDrawing from '@/components/TechnicalDrawing'
import ControlPanel from '@/components/ControlPanel'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { defaultLayoutSpec, LayoutSpec, ViewState, MeasurementTool, LayerVisibility } from '@shared/schema'

export default function Home() {
  const [layoutSpec, setLayoutSpec] = useState<LayoutSpec>(defaultLayoutSpec)
  const [viewState, setViewState] = useState<ViewState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    activeTab: 'plan'
  })
  const [measurement, setMeasurement] = useState<MeasurementTool>({
    isActive: false
  })
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false)

  const handleLayoutSpecChange = useCallback((updates: Partial<LayoutSpec>) => {
    setLayoutSpec(prev => ({ ...prev, ...updates }))
  }, [])

  const handleViewStateChange = useCallback((newViewState: ViewState) => {
    setViewState(newViewState)
  }, [])

  const handleMeasurementChange = useCallback((newMeasurement: MeasurementTool) => {
    setMeasurement(newMeasurement)
  }, [])

  const handleLayerVisibilityChange = useCallback((visibility: LayerVisibility) => {
    handleLayoutSpecChange({ layerVisibility: visibility })
  }, [handleLayoutSpecChange])

  const handleSelectionChange = useCallback((componentId: string | null) => {
    setViewState(prev => ({ ...prev, selectedComponentId: componentId || undefined }))
  }, [])

  const handleMeasurementToggle = useCallback(() => {
    setMeasurement(prev => ({ ...prev, isActive: !prev.isActive }))
  }, [])

  const handleExportSVG = useCallback(() => {
    // TODO: Implement SVG export
    const svgElement = document.querySelector('[data-testid="svg-technical-drawing"]') as SVGElement
    if (svgElement) {
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgElement)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'planta-baixa-lagoa.svg'
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [])

  const handleExportPNG = useCallback(() => {
    // TODO: Implement PNG export
    const svgElement = document.querySelector('[data-testid="svg-technical-drawing"]') as SVGElement
    if (svgElement) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgElement)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      
      img.onload = () => {
        canvas.width = img.width || 800
        canvas.height = img.height || 600
        ctx?.drawImage(img, 0, 0)
        
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob)
            const a = document.createElement('a')
            a.href = pngUrl
            a.download = 'planta-baixa-lagoa.png'
            a.click()
            URL.revokeObjectURL(pngUrl)
          }
        }, 'image/png')
        
        URL.revokeObjectURL(url)
      }
      
      img.src = url
    }
  }, [])

  const handlePrint = useCallback(() => {
    // TODO: Implement print functionality
    window.print()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {layoutSpec.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {layoutSpec.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Área Total</p>
                <p className="font-mono text-sm font-medium">
                  {layoutSpec.totalDimensions.length.toFixed(1)}m × {layoutSpec.totalDimensions.width.toFixed(1)}m
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={viewState.activeTab} onValueChange={(tab) => setViewState(prev => ({ ...prev, activeTab: tab as any }))}>
          <TabsList className="grid w-fit grid-cols-3 mb-6">
            <TabsTrigger value="plan" data-testid="tab-plan">
              Planta Baixa
            </TabsTrigger>
            <TabsTrigger value="section" data-testid="tab-section">
              Seção A-A
            </TabsTrigger>
            <TabsTrigger value="bom" data-testid="tab-bom">
              Lista de Materiais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plan">
            <div className="flex gap-6 h-[calc(100vh-16rem)]">
              {/* Drawing Area */}
              <div className="flex-1 min-w-0">
                <TechnicalDrawing
                  layoutSpec={layoutSpec}
                  onViewStateChange={handleViewStateChange}
                  onSelectionChange={handleSelectionChange}
                  onMeasurementChange={handleMeasurementChange}
                />
              </div>

              {/* Control Panel */}
              <div className="flex-shrink-0">
                <ControlPanel
                  layoutSpec={layoutSpec}
                  viewState={viewState}
                  measurement={measurement}
                  onLayerVisibilityChange={handleLayerVisibilityChange}
                  onLayoutSpecChange={handleLayoutSpecChange}
                  onMeasurementToggle={handleMeasurementToggle}
                  onExportSVG={handleExportSVG}
                  onExportPNG={handleExportPNG}
                  onPrint={handlePrint}
                  isCollapsed={isControlsCollapsed}
                  onToggleCollapse={() => setIsControlsCollapsed(!isControlsCollapsed)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="section">
            <div className="flex items-center justify-center h-[calc(100vh-16rem)] border border-border rounded-lg bg-muted/20">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Seção A-A</h3>
                <p className="text-muted-foreground mb-4">Vista em corte será implementada na próxima fase</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Perfil da inclinação do talude (1:1,5)</p>
                  <p>• Camadas de geomembrana e base</p>
                  <p>• Níveis de água e extravasor</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bom">
            <div className="flex items-center justify-center h-[calc(100vh-16rem)] border border-border rounded-lg bg-muted/20">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Lista de Materiais</h3>
                <p className="text-muted-foreground mb-4">BOM computada automaticamente será implementada na próxima fase</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Áreas de escavação e geomembrana</p>
                  <p>• Comprimentos de tubulações</p>
                  <p>• Volumes de concreto e materiais</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Technical Specifications Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Especificações Gerais</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Escavação: {layoutSpec.totalDimensions.length}m × {layoutSpec.totalDimensions.width}m</li>
              <li>• Área Útil: {layoutSpec.components.find(c => c.type === 'useful_area')?.dimensions.length || 0}m × {layoutSpec.components.find(c => c.type === 'useful_area')?.dimensions.width || 0}m</li>
              <li>• Talude: Inclinação 1:1,5</li>
            </ul>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Materiais</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Geomembrana HDPE 1,0mm</li>
              <li>• Canal de Coroamento em Concreto</li>
              <li>• Área de Acesso: {layoutSpec.components.find(c => c.type === 'access_area')?.dimensions.length || 0}m × {layoutSpec.components.find(c => c.type === 'access_area')?.dimensions.width || 0}m</li>
            </ul>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Tubulações</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Entrada: DN{layoutSpec.pipes.find(p => p.type === 'entrada')?.diameter || 150}</li>
              <li>• Extravasor: DN{layoutSpec.pipes.find(p => p.type === 'extravasor')?.diameter || 200}</li>
              <li>• Caixa de Decantação: 1,0m × 1,0m</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}