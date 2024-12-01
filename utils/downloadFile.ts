
export const downloadFile = (fileName: string) => {
  const link = document.createElement('a');
  link.href = `/${fileName}`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};