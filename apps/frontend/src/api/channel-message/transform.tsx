import type {TMessageWithUser} from '@/feature/server/components/message/message-types';
import type {TAllChannelMessageResponse} from './type';
import {BACKEND_URL} from '@/lib/env';

export function transformMessageWithUserFromDto(data: TAllChannelMessageResponse[]): TMessageWithUser[] {
  return data.map(({fromUser, ...val}) => {
    return {
      ...val,
      imageUrl: val.imageUrl ? `${BACKEND_URL}/${val.imageUrl}` : undefined,
      user: {
        id: fromUser.id,
        name: fromUser.name,
        userName: fromUser.userName,
        jointAt: fromUser.jointAt
      }
    };
  });
}
