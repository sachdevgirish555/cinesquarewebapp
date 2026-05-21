import { z } from "zod"

export const blogSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(10),
  category: z.string().min(3)
})
