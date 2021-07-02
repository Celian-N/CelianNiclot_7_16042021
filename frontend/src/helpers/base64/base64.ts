export const toBase64 = (file?: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file) return reject('No file');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/);
  if (!mime) return;
  const mimeType = mime[1];
  const type = mimeType.split('/')[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `${filename}.${type}`, { type: mimeType });
};
