"use client";

import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Resume } from "@/types/schema";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  FolderIcon,
  GraduationCapIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

interface ResumeContentProps {
  resume: Resume;
}

export function ResumeContent({ resume }: ResumeContentProps) {
  return (
    <PageTransition>
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-4 hover:-translate-x-0.5 active:translate-x-0 group"
          >
            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Terminal</span>
          </Link>

          {/* Header Section */}
          <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <UserIcon className="w-8 h-8 text-zinc-400" />
                <div>
                  <h1 className="text-2xl font-bold text-zinc-100">About Me</h1>
                  <p className="text-zinc-300 mt-2">{resume.about}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5 text-zinc-400" />
                <CardTitle className="text-xl text-zinc-100">
                  Experience
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.experience.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg hover:bg-zinc-800/50 transition-all hover:translate-x-1 group"
                >
                  <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-zinc-50">
                    {exp.position}
                  </h3>
                  <p className="text-sm text-zinc-400">{exp.company}</p>
                  <p className="text-zinc-300 mt-2">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
              <CardHeader>
                <CardTitle className="text-zinc-100">
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {resume.skills.technical.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
              <CardHeader>
                <CardTitle className="text-zinc-100">Soft Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {resume.skills.soft.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FolderIcon className="w-5 h-5 text-zinc-400" />
                <CardTitle className="text-xl text-zinc-100">
                  Projects
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              {resume.projects.map((project, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg hover:bg-zinc-800/50 transition-all hover:translate-x-1 group"
                >
                  <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-zinc-50">
                    {project.name}
                  </h3>
                  <p className="text-zinc-300 mt-2">{project.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCapIcon className="w-5 h-5 text-zinc-400" />
                <CardTitle className="text-xl text-zinc-100">
                  Education
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-100 font-medium">
                {resume.education.university}
              </p>
              <Separator className="my-4 bg-zinc-700" />
              <div className="space-y-2">
                {resume.education.certifications.map((cert, index) => (
                  <p
                    key={index}
                    className="text-zinc-300 hover:text-zinc-100 transition-colors hover:translate-x-1 transform duration-200"
                  >
                    {cert}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageTransition>
  );
}
