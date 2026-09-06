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
