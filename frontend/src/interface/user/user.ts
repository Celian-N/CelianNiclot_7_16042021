
export interface ICreateUser{
  firstname :string;
  lastname:string;
  email : string;
  job:string;
  password :string;
}

export interface IUser{
  id:string;
  firstname :string;
  lastname:string;
  email : string;
  job?:string;
  active: boolean;
  creationDate?: Date;
}