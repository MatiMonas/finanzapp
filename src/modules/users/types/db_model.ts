export type FindByUserEmailRequestData = {
  email: string;
} | null;

export type FindUserBydIdRequestData = {
  id: string;
  email: string;
  roles: string[];
} | null;
