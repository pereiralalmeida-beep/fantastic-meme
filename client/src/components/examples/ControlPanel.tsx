import { useState } from 'react'
import ControlPanel from '../ControlPanel'
import { defaultLayoutSpec, LayerVisibility, LayoutSpec, ViewState, MeasurementTool } from '@shared/schema'

export default function ControlPanelExample() {
  const [layoutSpec, setLayoutSpec] = useState<LayoutSpec>(defaultLayoutSpec)
  const [viewState, setViewState] = useState<ViewState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    activeTab: 'plan'
  })
  const [measurement, setMeasurement] = useState<MeasurementTool>({
    isActive: false
  })
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLayerVisibilityChange = (visibility: LayerVisibility) => {
    setLayoutSpec({ ...layoutSpec, layerVisibility: visibility })
  }

  const handleLayoutSpecChange = (updates: Partial<LayoutSpec>) => {
    setLayoutSpec({ ...layoutSpec, ...updates })
  }

  const handleMeasurementToggle = () => {
    setMeasurement({ ...measurement, isActive: !measurement.isActive })
    console.log('Measurement tool toggled')
  }

  const handleExportSVG = () => {
    console.log('Export SVG triggered')
  }

  const handleExportPNG = () => {
    console.log('Export PNG triggered')
  }

  const handlePrint = () => {
    console.log('Print triggered')
  }

  return (
    <div className="h-96 p-4">
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
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
    </div>
  )
}