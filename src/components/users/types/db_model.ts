export type FindByUserEmailRequestData = {
  id: string;
  email: string;
  roles: string[];
} | null;

export type FindUserBydIdRequestData = {
  id: string;
  email: string;
  roles: string[];
} | null;

export type FindByUserEmailBasicData = {
  id: string;
  email: string;
} | null;

export type FindUserBydIdBasicData = {
  id: string;
  email: string;
} | null;
