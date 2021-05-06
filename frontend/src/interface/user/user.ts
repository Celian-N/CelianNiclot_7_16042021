
export interface ICreateUser{
  firstname :string;
  lastname:string;
  email : string;
  job:string;
  password :string;
}

export interface IUser{
  id:number;
  firstname :string;
  lastname:string;
  email : string;
  job?:string;
  active: boolean;
  creationDate?: Date;
}