export type FindByUserEmailRequestData = {
  email: string;
};

export type FindUserBydIdRequestData = {
  id: string;
  email: string;
  roles: string[];
};
