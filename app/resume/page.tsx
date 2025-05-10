import { ResumeContent } from '@/components/ResumeContent';
import { getResumeData } from '@/utils/resumeParser';

export default function ResumePage() {
  const resume = getResumeData();
  if (!resume) return null;

  return <ResumeContent resume={resume} />;
}
