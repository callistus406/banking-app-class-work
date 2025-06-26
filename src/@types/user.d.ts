export interface IPreRegister {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
};


export interface IRegister {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  otp?:string;
};
