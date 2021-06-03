export interface ICreateUser {
  firstname: string;
  lastname: string;
  email: string;
  job?: string;
  userPic?: File | null;
  password: string;
}

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  userPic?: string;
  job?: string;
  active: boolean;
  creationDate?: Date;
  adminRole : boolean;
}
