import { Date } from "mongoose";

export interface IAddUser {
  title: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  gender: string;
  date_of_birth: Date;
  phone_number: string;
  age: number;
  id: number;
  address: {
    street: string;
    city: string;
    state: string;
    postcode: number;
  };
  picture: string;
  occupation: string;
};
