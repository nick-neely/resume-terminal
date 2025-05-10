export const togglePrintMode = () => {
  const resumeContent = document.querySelector('[data-resume-content]');
  if (resumeContent) {
    resumeContent.classList.toggle('print-mode');
  }
};

export const isPrintMode = () => {
  const resumeContent = document.querySelector('[data-resume-content]');
  return resumeContent?.classList.contains('print-mode') ?? false;
};
