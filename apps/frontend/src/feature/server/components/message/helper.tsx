import type {TMessageWithUser} from './message-types';
import {format, isToday, isYesterday} from 'date-fns';
import {enUS} from 'date-fns/locale';

export function formatMessageDate(date: string | Date): string {
  const messageDate = new Date(date);

  if (isToday(messageDate)) {
    return format(messageDate, 'h:mm a', {
      locale: enUS
    });
  }

  if (isYesterday(messageDate)) {
    return `Yesterday at ${format(messageDate, 'h:mm a', {
      locale: enUS
    })}`;
  }

  return format(messageDate, 'dd/MM/yyyy h:mm a', {
    locale: enUS
  });
}

export const groupMessages = (messages: TMessageWithUser[]) => {
  const groups: TMessageWithUser[][] = [];
  for (const message of messages) {
    const previousGroup = groups.at(-1);
    const previousMessage = previousGroup?.at(-1);

    if (previousMessage && previousMessage.from === message.from && isWithinGroupWindow(previousMessage.createdAt, message.createdAt)) {
      previousGroup?.push(message);
      continue;
    }

    groups.push([message]);
  }

  return groups;
};

const isWithinGroupWindow = (previousDate: string, currentDate: string) => {
  const difference = new Date(currentDate).getTime() - new Date(previousDate).getTime();

  return difference <= 5 * 60 * 1000;
};
