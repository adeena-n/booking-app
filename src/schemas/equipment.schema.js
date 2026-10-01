import { z } from "zod";

const condition = z.enum(["Good", "Fair", "Poor", "Damaged"]);
const maintenanceStatus = z.enum(["Operational", "Under Maintenance"]);
const idParams = z.object({ id: z.string().uuid() });

export const listEquipmentSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    labId: z.string().uuid().optional(),
    maintenanceStatus: maintenanceStatus.optional(),
  }),
});

export const equipmentIdSchema = z.object({ params: idParams });

export const createEquipmentSchema = z.object({
  body: z
    .object({
      name: z.string().min(2),
      category: z.string().min(2),
      totalQuantity: z.number().int().positive(),
      availableQuantity: z.number().int().min(0).optional(),
      condition: condition.optional(),
      maintenanceStatus: maintenanceStatus.optional(),
      labId: z.string().uuid().optional(),
    })
    .refine(
      (b) => b.availableQuantity === undefined || b.availableQuantity <= b.totalQuantity,
      { message: "availableQuantity cannot exceed totalQuantity", path: ["availableQuantity"] }
    ),
});

export const updateEquipmentSchema = z.object({
  params: idParams,
  body: z
    .object({
      name: z.string().min(2),
      category: z.string().min(2),
      totalQuantity: z.number().int().positive(),
      availableQuantity: z.number().int().min(0),
      condition,
      maintenanceStatus,
      labId: z.string().uuid(),
    })
    .partial(),
});