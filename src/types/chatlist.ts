export type ChatList = {
  roomId: number;
  shopId: number;
  shopName: string;
  opponentId: number;
  opponentName: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
  isExited: boolean;
};

export type CustomerList = {
  name: string;
  tag?: string;
};
