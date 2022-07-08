export type UserInfo = {
  id: string;
  name: string;
  profile_image: string;
  method: string;
  meetings: string[];
} | null;

export type ChangableUserInfo = {
  name?: string;
  profile_image?: string;
  meetings?: string[];
};

export type User = {
  info: UserInfo;
  validated: boolean;
};
