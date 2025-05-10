'use client';

import { PageTransition } from '@/components/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, getCompanyDuration } from '@/lib/utils';
import { Resume } from '@/types/schema';
import { isPrintMode } from '@/utils/printMode';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  FolderIcon,
  GithubIcon,
  GraduationCapIcon,
  LinkIcon,
  LinkedinIcon,
  MailIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { QuickMenu } from './QuickMenu';
import { ScrollProgress } from './ScrollProgress';
import { Button } from './ui/button';

interface ResumeContentProps {
  resume: Resume;
}

export function ResumeContent({ resume }: ResumeContentProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    const handlePrintMode = () => setPrintMode(isPrintMode());
    window.addEventListener('resize', handlePrintMode); // catch mode changes
    const observer = new MutationObserver(handlePrintMode);
    const el = document.querySelector('[data-resume-content]');
    if (el) observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    handlePrintMode();
    return () => {
      window.removeEventListener('resize', handlePrintMode);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
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
            viewport={{ once: true, margin: '-100px' }}
            className="print-mt-0"
          >
            <div data-section className="section-wrapper">
              <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-zinc-100">
                    {resume.personalInfo.name}
                  </CardTitle>
                  <p className="text-lg text-zinc-400">
                    {resume.personalInfo.title}
                    {resume.personalInfo.currentEmployer && (
                      <span className="ml-2 text-zinc-400 font-normal">
                        @ {resume.personalInfo.currentEmployer}
                      </span>
                    )}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-center gap-4 text-sm">
                  <a
                    href={`mailto:${resume.personalInfo.contact.email}`}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <MailIcon className="w-4 h-4" />
                    {resume.personalInfo.contact.email}
                  </a>
                  {!printMode && (
                    <>
                      {resume.personalInfo.contact.website && (
                        <Link
                          href={resume.personalInfo.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Website
                        </Link>
                      )}
                      {resume.personalInfo.contact.linkedin && (
                        <Link
                          href={resume.personalInfo.contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <LinkedinIcon className="w-4 h-4" />
                          LinkedIn
                        </Link>
                      )}
                      {resume.personalInfo.contact.github && (
                        <Link
                          href={resume.personalInfo.contact.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <GithubIcon className="w-4 h-4" />
                          GitHub
                        </Link>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="print-mt-0"
          >
            <div data-section className="section-wrapper">
              {/* Header Section */}
              <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-zinc-400" />
                    <CardTitle className="text-xl text-zinc-100">About Me</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300">{resume.about}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div data-section className="section-wrapper">
              {/* Experience Section */}
              <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-zinc-400" />
                    <CardTitle className="text-xl text-zinc-100">Experience</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Group experiences by company */}
                  {(() => {
                    const grouped: {
                      [company: string]: typeof resume.experience;
                    } = {};
                    resume.experience.forEach((exp) => {
                      if (!grouped[exp.company]) grouped[exp.company] = [];
                      grouped[exp.company].push(exp);
                    });
                    // Maintain order as in resume.experience
                    const orderedCompanies = resume.experience.reduce((arr, exp) => {
                      if (!arr.includes(exp.company)) arr.push(exp.company);
                      return arr;
                    }, [] as string[]);
                    return orderedCompanies.map((company) => {
                      const jobs = grouped[company];
                      // Only render duration on client
                      const duration = now ? getCompanyDuration(jobs, now) : '';
                      return (
                        <div
                          key={company}
                          className="border border-zinc-800 rounded-lg overflow-hidden"
                        >
                          {/* Company header with duration */}
                          <div className="bg-zinc-800/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-100">{company}</h3>
                              <p className="text-sm text-zinc-400">{jobs[0].location}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 md:mt-0">
                              <BriefcaseIcon className="w-4 h-4 text-zinc-400" />
                              <span className="text-xs text-zinc-300">{duration}</span>
                            </div>
                          </div>
                          {/* All positions at this company */}
                          {jobs.map((exp, idx) => (
                            <div key={idx} className="p-4 hover:bg-zinc-800/50 transition-all">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                  <h4 className="font-medium text-zinc-200">{exp.position}</h4>
                                </div>
                                <div className="text-xs text-zinc-400 md:text-right">
                                  {exp.startDate} - {exp.endDate}
                                </div>
                              </div>
                              {exp.responsibilities && exp.responsibilities.length > 0 && (
                                <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-300">
                                  {exp.responsibilities.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    });
                  })()}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div data-section className="section-wrapper">
              {/* Skills Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Technical Skills</CardTitle>
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
            viewport={{ once: true, margin: '-100px' }}
          >
            <div data-section className="section-wrapper">
              {/* Projects Section */}
              <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FolderIcon className="w-5 h-5 text-zinc-400" />
                    <CardTitle className="text-xl text-zinc-100">Projects</CardTitle>
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
            </div>
          </motion.div>

          <motion.div
            data-animate
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div data-section className="section-wrapper">
              {/* Education Section */}
              <Card className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <GraduationCapIcon className="w-5 h-5 text-zinc-400" />
                    <CardTitle className="text-xl text-zinc-100">Education</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-100 font-medium">{resume.education.university}</p>
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
            showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
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
