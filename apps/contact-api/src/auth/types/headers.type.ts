export type IRequestUser = Request;

export type IAuthRequest = IRequestUser & {
  authorization: string;
};
