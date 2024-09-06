export type FindByUserEmailRequestData = {
  email: string;
};

export type FindUserBydIdRequestData = {
  id: number;
  email: string;
  roles: string[];
};
