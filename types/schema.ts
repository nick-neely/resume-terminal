import { z } from "zod";

export const ResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    title: z.string(),
    contact: z.object({
      email: z.string(),
      phone: z.string().optional(),
      website: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    }),
  }),
  about: z.string(),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      responsibilities: z.array(z.string()),
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
