"use client";

import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getResumeData } from "@/utils/resumeParser";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  FolderIcon,
  GraduationCapIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { ResumeContent } from "@/components/ResumeContent";

export default function ResumePage() {
  const resume = getResumeData();
  if (!resume) return null;

  return <ResumeContent resume={resume} />;
}
