import type {TMessageWithUser} from '@/feature/server/components/message/message-types';
import type {TAllChannelMessageResponse} from './type';
import {APPWRITE_BUCKETS_IDS} from '@/lib/env';
import { getFileViewUrl } from '@/lib/utils';

export function transformMessageWithUserFromDto(data: TAllChannelMessageResponse[]): TMessageWithUser[] {
  return data.map(({fromUser, ...val}) => {
    return {
      ...val,
      imageUrl: val.imageUrl ? `${getFileViewUrl(APPWRITE_BUCKETS_IDS.image,val.imageUrl)}` : undefined,
      user: {
        id: fromUser.id,
        name: fromUser.name,
        userName: fromUser.userName,
        jointAt: fromUser.jointAt
      }
    };
  });
}
