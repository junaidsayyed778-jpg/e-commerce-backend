import z from "zod";
import { describe } from "zod/v4/core";

export const createProductSchema = z.object({
   name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),      // ✅ NUMBER
  category: z.string(),
  stock: z.number().int().min(0),    // ✅ NUMBER
  Image: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();