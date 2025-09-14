// types/person.ts

export type Person = {
  name: string;
  id: string;
  accountNumber: string;
  salary: number;
  dob: string; // ISO date string
  location: {
    city: string;
    coords: {
      lat: number;
      lng: number;
    };
  };
};
