import { useState } from 'react'
import LegendPanel from '../LegendPanel'

export default function LegendPanelExample() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="h-96 p-4">
      <LegendPanel 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
    </div>
  )
}