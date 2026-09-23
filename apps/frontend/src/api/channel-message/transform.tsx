import type {TMessageWithUser} from '@/feature/server/components/message/message-types';
import type {TAllChannelMessageResponse} from './type';

export function transformMessageWithUserFromDto(data: TAllChannelMessageResponse[]): TMessageWithUser[] {
  return data.map(({fromUser, ...val}) => {
    return {
      ...val,
      user: {
        id: fromUser.id,
        name: fromUser.name,
        userName: fromUser.userName
      }
    };
  });
}
