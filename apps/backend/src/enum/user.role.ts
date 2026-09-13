export const USER_ROLES = ['MEMBER', 'OWNER', 'ADMIN'] as const;
export type TUserRole = (typeof USER_ROLES)[number];
