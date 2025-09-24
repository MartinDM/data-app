export type Person = {
  id: string;
  name: string;
  risk: number;
  accountNumber: string;
  salary: number;
  bio: string;
  dob: string; // ISO date string
  location: {
    city: string;
    coords: {
      lat: number;
      lng: number;
    };
  };
};
