export {cn} from 'cn';
import {format} from 'date-fns';
import {enUS} from 'date-fns/locale';

export function formatDate(date: string | Date, dateFormat = 'dd/MM/yyyy'): string {
  return format(new Date(date), dateFormat, {
    locale: enUS
  });
}
type IFormatOption = {
  numOfLetter?: number;
  mode?: 'normal' | 'first-letter-of-words';
};
export function formatText(text: string, option?: IFormatOption) {
  const numOfLetter = option?.numOfLetter || 20;
  const mode = option?.mode || 'normal';
  if (mode == 'first-letter-of-words')
    return text
      .split(' ')
      .map(it => it[0].toUpperCase())
      .join('')
      .slice(0, numOfLetter);
  if (text.length > numOfLetter) return `${text.slice(0, numOfLetter)}..`;
  return text;
}

export const urlToFile = async (url?: string, fallbackName = 'file'): Promise<File> => {
  if (!url) return new File([], fallbackName, {});
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  const blob = await response.blob();

  const fileName = url.split('/').pop()?.split('?')[0] || fallbackName;

  return new File([blob], fileName, {
    type: blob.type
  });
};
