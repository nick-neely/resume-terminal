import { ResumeSchema } from '@/types/schema';
import resumeData from '../config/resume.json';

export const getResumeData = () => {
  try {
    return ResumeSchema.parse(resumeData);
  } catch (error) {
    console.error('Error parsing resume data:', error);
    return null;
  }
};
