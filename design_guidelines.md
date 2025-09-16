# Design Guidelines: Technical Layout Visualization Application

## Design Approach
**Selected Approach:** Design System Approach (Material Design)
**Justification:** This is a utility-focused engineering application requiring precision, clarity, and professional presentation of technical data. Material Design provides excellent support for data visualization, clear typography hierarchy, and structured layouts essential for technical documentation.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Primary: 210 100% 50% (Engineering blue for technical precision)
- Primary Dark: 210 100% 40%
- Surface: 210 15% 7% (Dark mode background)
- Surface Light: 0 0% 98% (Light mode background)

**Semantic Colors:**
- Excavation boundary: 25 85% 55% (Construction orange)
- Water areas: 200 85% 60% (Clear blue)
- Infrastructure: 120 25% 45% (Neutral green for pipes/equipment)
- Measurements: 0 0% 30% (Dark gray for dimension lines)

### B. Typography
**Font System:** Roboto (Google Fonts)
- Headers: Roboto Medium 24px/20px for titles
- Technical labels: Roboto Regular 14px for component names
- Dimensions: Roboto Mono 12px for precise measurements
- Body text: Roboto Regular 16px for descriptions

### C. Layout System
**Spacing Units:** Tailwind spacing of 2, 4, 6, and 8
- Component spacing: p-4, m-6
- Layout margins: p-8
- Tight spacing for technical elements: p-2
- Generous spacing for readability: m-8

### D. Component Library

**Primary Components:**
- **Technical Drawing Canvas:** Large centered viewport (min-height of 70vh) with zoom/pan controls
- **Dimension Indicators:** Precise measurement lines with arrows and metric labels
- **Legend Panel:** Collapsible sidebar with component explanations and color coding
- **Scale Controls:** Zoom in/out buttons and scale indicator (1:100, 1:200, etc.)
- **Component Tooltips:** Hover details showing technical specifications

**Navigation:**
- Clean top navigation with project title "PLANTA BAIXA - VISTA SUPERIOR"
- Tool palette for view options (grid toggle, measurement toggle)
- Export/print functionality buttons

**Technical Drawing Elements:**
- Grid overlay with meter increments
- Precise geometric shapes for each component
- Dashed lines for excavation boundaries
- Solid fills for water areas with transparency
- Technical hatching for geomembrana areas
- Infrastructure symbols for pipes and equipment

### E. Visual Treatment
**Technical Precision Focus:**
- Sharp, precise lines (1-2px stroke width)
- High contrast for dimension text
- Subtle shadows only for component separation
- Clean geometric shapes matching engineering standards
- Professional technical drawing aesthetics

**Interactive Elements:**
- Subtle hover effects on components (slight opacity change)
- Click-to-highlight individual elements
- Smooth zoom transitions (200ms duration)
- No distracting animations - focus on precision and clarity

**Responsive Considerations:**
- Scalable vector graphics for all technical elements
- Responsive canvas that maintains aspect ratios
- Mobile-friendly legend panel that converts to bottom sheet
- Touch-friendly zoom controls for tablet/mobile viewing

This design emphasizes engineering precision, technical clarity, and professional presentation suitable for construction and water treatment facility documentation.