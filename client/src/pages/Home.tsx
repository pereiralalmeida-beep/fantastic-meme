import { useState } from 'react'
import TechnicalDrawing from '@/components/TechnicalDrawing'
import LegendPanel from '@/components/LegendPanel'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                PLANTA BAIXA - VISTA SUPERIOR
              </h1>
              <p className="text-muted-foreground mt-1">
                Lagoa de Tratamento - Dimensões e Componentes Técnicos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Área Total</p>
                <p className="font-mono text-sm font-medium">22,0m × 19,0m</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6 h-[calc(100vh-12rem)]">
          {/* Drawing Area */}
          <div className="flex-1 min-w-0">
            <TechnicalDrawing />
          </div>

          {/* Legend Panel */}
          <div className="flex-shrink-0">
            <LegendPanel
              isCollapsed={isLegendCollapsed}
              onToggle={() => setIsLegendCollapsed(!isLegendCollapsed)}
            />
          </div>
        </div>

        {/* Technical Specifications Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Especificações Gerais</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Escavação: 22,0m × 19,0m</li>
              <li>• Área Útil: 13,0m × 10,0m</li>
              <li>• Talude: Inclinação 1:1,5</li>
            </ul>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Materiais</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Geomembrana HDPE 1,0mm</li>
              <li>• Canal de Coroamento em Concreto</li>
              <li>• Área de Acesso: 3,0m × 3,0m</li>
            </ul>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Tubulações</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Entrada: DN150</li>
              <li>• Extravasor: DN200</li>
              <li>• Caixa de Decantação: 1,0m × 1,0m</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}