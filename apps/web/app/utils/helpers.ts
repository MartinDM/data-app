import { Person } from '../types/person';

import { faker } from '@faker-js/faker';

export function createPeople(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => {
    return {
      id: `U${(1000 + index).toString().padStart(4, '0')}`,
      name: faker.person.fullName(),
      risk: faker.number.int({ min: 0, max: 100 }),
      accountNumber: faker.finance.accountNumber(),
      salary: faker.number.int({ min: 30000, max: 120000 }),
      bio: faker.person.bio(),
      dob: faker.date.past({ years: 30 }).toISOString().slice(0, 10),
      location: {
        city: faker.location.city(),
        coords: {
          lat: parseFloat(faker.location.latitude()),
          lng: parseFloat(faker.location.longitude()),
        },
      },
    };
  });
}
