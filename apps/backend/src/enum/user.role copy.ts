export const CHANNEL_TYPE = ['TEXT', 'VOICE'] as const;
export type TChannelType = (typeof CHANNEL_TYPE)[number];
