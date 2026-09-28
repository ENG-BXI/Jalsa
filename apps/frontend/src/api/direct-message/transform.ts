import type {TMessageWithUser} from '@/feature/server/components/message/message-types';
import type {TGetAllDMMessage} from './type';

export function transformDMMessageWithUserFromDto(data: TGetAllDMMessage[]): TMessageWithUser[] {
  return data.map(({fromUser, ...val}) => {
    return {
      id: val.id,
      text: val.text,
      imageUrl: val.imageUrl,
      createdAt: val.createdAt,
      updatedAt: val.updatedAt,
      softDelete: val.softDelete,
      from: fromUser.id,
      user: {
        id: fromUser.id,
        name: fromUser.name,
        userName: fromUser.userName,
        jointAt: fromUser.jointAt
      }
    };
  });
}
