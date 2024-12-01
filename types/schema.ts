
import { z } from "zod";

export const ResumeSchema = z.object({
  about: z.string(),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      duration: z.string(),
      description: z.string(),
    })
  ),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
  }),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
  education: z.object({
    university: z.string(),
    certifications: z.array(z.string()),
  }),
});

export type Resume = z.infer<typeof ResumeSchema>;