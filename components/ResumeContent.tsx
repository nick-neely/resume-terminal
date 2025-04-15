"use client";

import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Resume } from "@/types/schema";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  FolderIcon,
  GraduationCapIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QuickMenu } from "./QuickMenu";
import { ScrollProgress } from "./ScrollProgress";
import { Button } from "./ui/button";

interface ResumeContentProps {
  resume: Resume;
}

export function ResumeContent({ resume }: ResumeContentProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <PageTransition>
      <ScrollProgress />
      <main className="p-8" data-resume-content>
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            data-animate
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="no-print"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-4 hover:-translate-x-0.5 active:translate-x-0 group"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Terminal</span>
            </Link>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="print-mt-0"
          >
            <div data-section className="section-wrapper">
              {/* Header Section */}
              <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-zinc-400" />
                    <CardTitle className="text-xl text-zinc-100">
                      About Me
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-zinc-100">
                      {resume.personalInfo.name}
                    </p>
                    <a
                      href={`mailto:${resume.personalInfo.email}`}
                      className="text-zinc-400 hover:text-zinc-200 underline text-sm"
                    >
                      {resume.personalInfo.email}
                    </a>
                    <div className="flex gap-4 mt-2">
                      {resume.personalInfo.links.github && (
                        <Link
                          href={resume.personalInfo.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                          </svg>
                          <span className="text-sm">GitHub</span>
                        </Link>
                      )}
                      {resume.personalInfo.links.linkedin && (
                        <Link
                          href={resume.personalInfo.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                          </svg>
                          <span className="text-sm">LinkedIn</span>
                        </Link>
                      )}
                      {resume.personalInfo.links.website && (
                        <Link
                          href={resume.personalInfo.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
                          </svg>
                          <span className="text-sm">Website</span>
                        </Link>
                      )}
                    </div>
                  </div>
                  <p className="text-zinc-300 mt-4">{resume.about}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div data-section className="section-wrapper">
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
            </div>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div data-section className="section-wrapper">
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
            </div>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div data-section className="section-wrapper">
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
                      <p className="text-zinc-300 mt-2">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div data-section className="section-wrapper">
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
          </motion.div>
        </div>
        <Button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full bg-zinc-800 text-zinc-100 shadow-md transition-all duration-200 hover:bg-zinc-700 hover:scale-110 active:scale-95 hidden md:block ${
            showBackToTop
              ? "translate-y-0 opacity-100"
              : "translate-y-16 opacity-0"
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="w-5 h-5" />
        </Button>
        <QuickMenu />
      </main>
    </PageTransition>
  );
}
