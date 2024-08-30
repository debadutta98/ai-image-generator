import { History, ImageFormSetting } from '@/types';

export const calculateAspectRatio = (
  width: number,
  height: number,
  appendAspectRatio: boolean = true
) => {
  const gcd: (a: number, b: number) => number = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const aspectRatioWidth = width / divisor;
  const aspectRatioHeight = height / divisor;
  if (appendAspectRatio) {
    return `${width} x ${height} (${aspectRatioWidth}:${aspectRatioHeight})`;
  } else {
    return `${width} x ${height}`;
  }
};

export const getWindow = () => {
  if (typeof window !== 'undefined') {
    return window;
  } else {
    return null;
  }
};

export const downloadImage = async (imageUrl: string, fileName: string) => {
  const data = await fetch(imageUrl, {
    method: 'GET'
  }).then(async (res) => {
    if (res.ok) {
      return await res.blob();
    }
  });
  if (data instanceof Blob) {
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const getImageSettings: () => ImageFormSetting = () => {
  if (typeof sessionStorage === 'object' && sessionStorage.getItem('imageSettings')) {
    const setting = sessionStorage.getItem('imageSettings');
    if (typeof setting === 'string') {
      const history = JSON.parse(setting) as History;
      return {
        prompt: history.prompt,
        negativePrompt: history.negative_prompt,
        color: history.color,
        resolution: calculateAspectRatio(history.width, history.height, false),
        guidance: history.guidance_scale,
        seed: history.seed
      };
    }
  }
  return {
    prompt: '',
    negativePrompt: '',
    color: '#dd524c',
    resolution: '1024 x 1024',
    guidance: 5.0
  };
};
