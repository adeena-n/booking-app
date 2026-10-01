import { z } from "zod";

const labStatus = z.enum(["Available", "Reserved", "In Use", "Maintenance", "Closed"]);
const idParams = z.object({ id: z.string().uuid() });

export const listLabsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: labStatus.optional(),
    departmentId: z.string().uuid().optional(),
  }),
});

export const labIdSchema = z.object({ params: idParams });

export const createLabSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    capacity: z.number().int().positive(),
    location: z.string().optional(),
    facilities: z.array(z.string()).default([]),
    status: labStatus.optional(),
    departmentId: z.string().uuid().optional(),
  }),
});

export const updateLabSchema = z.object({
  params: idParams,
  body: z
    .object({
      name: z.string().min(2),
      capacity: z.number().int().positive(),
      location: z.string(),
      facilities: z.array(z.string()),
      status: labStatus,
      departmentId: z.string().uuid(),
    })
    .partial(),
});