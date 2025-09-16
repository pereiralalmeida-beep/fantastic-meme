# Overview

This is a technical layout visualization application for displaying engineering drawings, specifically focused on treatment lagoon floor plans. The application renders interactive technical drawings with precise measurements, layer controls, and professional CAD-style visualization. It's built as a full-stack web application using React for the frontend and Express.js for the backend, designed to display technical specifications like excavation boundaries, slopes, water areas, pipes, and infrastructure components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses **React with TypeScript** in a component-based architecture:

- **UI Framework**: Built with Radix UI components and shadcn/ui for consistent, accessible interface elements
- **Styling**: Tailwind CSS with custom design tokens following Material Design principles for technical applications
- **State Management**: React hooks and TanStack Query for server state management
- **Drawing Engine**: Custom SVG-based rendering system with layered architecture for technical drawings
- **Theme System**: Dark/light mode support with CSS custom properties

## Backend Architecture

The backend follows a **minimal Express.js REST API pattern**:

- **Server Framework**: Express.js with TypeScript for type safety
- **Storage Interface**: Abstracted storage layer with in-memory implementation (designed for easy database integration)
- **Development Setup**: Vite integration for hot module replacement in development
- **Build System**: ESBuild for production bundling with platform-specific optimizations

## Data Storage Solutions

- **Current Implementation**: In-memory storage for development and prototyping
- **Database Ready**: Drizzle ORM configured with PostgreSQL schema definitions
- **Schema Design**: Structured schemas for users, technical components, pipe specifications, and dimensional data
- **Migration Support**: Drizzle-kit configured for database schema management

## Drawing System Architecture

The technical drawing system uses a **layered SVG architecture**:

- **Layer Components**: Modular components for grid, boundary, slope, water, geomembrane, pipes, access areas, dimensions, and annotations
- **Interactive Controls**: Zoom, pan, measurement tools, and layer visibility toggles
- **Export Capabilities**: SVG and PNG export functionality with print support
- **Professional Standards**: Precise scaling, dimension indicators, and technical symbols

# External Dependencies

## UI and Design
- **Radix UI**: Headless UI primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon system for technical interface elements
- **shadcn/ui**: Pre-built component library with design system consistency

## Development Tools
- **Vite**: Build tool with hot module replacement and development server
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind integration

## Data Management
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL for cloud deployment
- **Zod**: Schema validation and type inference
- **TanStack Query**: Server state management with caching

## Fonts and Typography
- **Google Fonts**: Roboto and Roboto Mono for technical precision and readability
- **Font Loading**: Optimized font loading with preconnect hints

## Form Handling
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Integration with validation libraries