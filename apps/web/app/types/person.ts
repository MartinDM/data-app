export type Person = {
  id: string;
  name: string;
  risk: number;
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
