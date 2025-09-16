import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Existing user schema
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// New technical layout schemas
export const dimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
});

export const pipeSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  diameter: z.number().positive(),
  type: z.enum(['entrada', 'extravasor', 'bombeamento']),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  direction: z.enum(['horizontal', 'vertical']),
});

export const componentSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['excavation', 'slope', 'useful_area', 'geomembrane', 'concrete_channel', 'access_area', 'sedimentation_box']),
  dimensions: dimensionsSchema,
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  material: z.string().optional(),
  specifications: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export const layerVisibilitySchema = z.object({
  grid: z.boolean().default(true),
  boundary: z.boolean().default(true),
  slope: z.boolean().default(true),
  water: z.boolean().default(true),
  geomembrane: z.boolean().default(true),
  pipes: z.boolean().default(true),
  access: z.boolean().default(true),
  dimensions: z.boolean().default(true),
  annotations: z.boolean().default(true),
  labels: z.boolean().default(true),
});

export const layoutSpecSchema = z.object({
  title: z.string().default("PLANTA BAIXA - VISTA SUPERIOR"),
  description: z.string().default("Lagoa de Tratamento"),
  scale: z.string().default("1:100"),
  project: z.string().optional(),
  date: z.string().optional(),
  totalDimensions: dimensionsSchema,
  components: z.array(componentSpecSchema),
  pipes: z.array(pipeSpecSchema),
  layerVisibility: layerVisibilitySchema,
});

export const measurementToolSchema = z.object({
  isActive: z.boolean().default(false),
  startPoint: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  endPoint: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  distance: z.number().optional(),
});

export const viewStateSchema = z.object({
  zoom: z.number().min(0.1).max(10).default(1),
  pan: z.object({
    x: z.number().default(0),
    y: z.number().default(0),
  }),
  selectedComponentId: z.string().optional(),
  activeTab: z.enum(['plan', 'section', 'bom']).default('plan'),
});

// Export types
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type PipeSpec = z.infer<typeof pipeSpecSchema>;
export type ComponentSpec = z.infer<typeof componentSpecSchema>;
export type LayerVisibility = z.infer<typeof layerVisibilitySchema>;
export type LayoutSpec = z.infer<typeof layoutSpecSchema>;
export type MeasurementTool = z.infer<typeof measurementToolSchema>;
export type ViewState = z.infer<typeof viewStateSchema>;

// Default layout specification for the lagoa
export const defaultLayoutSpec: LayoutSpec = {
  title: "PLANTA BAIXA - VISTA SUPERIOR",
  description: "Lagoa de Tratamento - Dimensões e Componentes Técnicos",
  scale: "Variável",
  totalDimensions: {
    length: 22.0,
    width: 19.0,
  },
  components: [
    {
      id: "excavation",
      name: "Limite da Escavação",
      type: "excavation",
      dimensions: { length: 22.0, width: 19.0 },
      position: { x: 0, y: 0 },
      specifications: { note: "Topo da escavação" }
    },
    {
      id: "slope",
      name: "Talude 1:1,5",
      type: "slope",
      dimensions: { length: 19.0, width: 16.0 },
      position: { x: 1.5, y: 1.5 },
      specifications: { inclination: "1:1,5" }
    },
    {
      id: "useful_area",
      name: "Área Útil da Lagoa",
      type: "useful_area",
      dimensions: { length: 13.0, width: 10.0 },
      position: { x: 4.5, y: 4.5 },
    },
    {
      id: "geomembrane",
      name: "Geomembrana HDPE",
      type: "geomembrane",
      dimensions: { length: 13.2, width: 10.2 },
      position: { x: 4.4, y: 4.4 },
      material: "HDPE",
      specifications: { thickness: "1.0mm" }
    },
    {
      id: "concrete_channel",
      name: "Canal de Coroamento",
      type: "concrete_channel",
      dimensions: { length: 21.0, width: 18.0 },
      position: { x: 0.5, y: 0.5 },
      material: "Concreto"
    },
    {
      id: "access_area",
      name: "Área de Acesso/Bombeamento",
      type: "access_area",
      dimensions: { length: 3.0, width: 3.0 },
      position: { x: 18.0, y: 1.0 },
    },
    {
      id: "sedimentation_box",
      name: "Caixa de Decantação",
      type: "sedimentation_box",
      dimensions: { length: 1.0, width: 1.0 },
      position: { x: 2.0, y: 2.0 },
    }
  ],
  pipes: [
    {
      id: "inlet",
      name: "Tubulação de Entrada",
      diameter: 150,
      type: "entrada",
      position: { x: 0, y: 9.5 },
      direction: "horizontal"
    },
    {
      id: "outlet",
      name: "Tubulação de Extravasor",
      diameter: 200,
      type: "extravasor", 
      position: { x: 22, y: 9.5 },
      direction: "horizontal"
    }
  ],
  layerVisibility: {
    grid: true,
    boundary: true,
    slope: true,
    water: true,
    geomembrane: true,
    pipes: true,
    access: true,
    dimensions: true,
    annotations: true,
    labels: true,
  }
};