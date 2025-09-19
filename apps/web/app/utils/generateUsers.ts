import { Person } from '../types/person';

export function generateUsers(): Person[] {
  const firstNames = [
    'Alice',
    'Bob',
    'Carol',
    'David',
    'Eve',
    'Frank',
    'Grace',
    'Hank',
    'Ivy',
    'Jack',
    'Kara',
    'Liam',
    'Mona',
    'Nate',
    'Olga',
    'Paul',
    'Quinn',
    'Rita',
    'Sam',
    'Tina',
    'Uma',
    'Vince',
    'Wade',
    'Xena',
    'Yuri',
    'Zane',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Lee',
    'Kim',
    'Brown',
    'Davis',
    'Miller',
    'Wilson',
    'Moore',
    'Taylor',
    'Anderson',
    'Thomas',
    'Jackson',
    'White',
    'Harris',
    'Martin',
    'Thompson',
    'Garcia',
    'Martinez',
    'Robinson',
  ];
  const cities = [
    { city: 'New York', lat: 40.7128, lng: -74.006 },
    { city: 'London', lat: 51.5074, lng: -0.1278 },
    { city: 'Tokyo', lat: 35.6895, lng: 139.6917 },
    { city: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { city: 'Berlin', lat: 52.52, lng: 13.405 },
    { city: 'Paris', lat: 48.8566, lng: 2.3522 },
    { city: 'Toronto', lat: 43.6532, lng: -79.3832 },
    { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { city: 'Cape Town', lat: -33.9249, lng: 18.4241 },
    { city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  ];
  const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  return Array.from({ length: 50 }, (_, i) => {
    const name = `${random(firstNames)} ${random(lastNames)}`;
    const id = `U${(1000 + i).toString().padStart(4, '0')}`;
    const accountNumber = `ACCT${(5000 + i).toString().padStart(6, '0')}`;
    const salary = Math.round((30000 + Math.random() * 120000) * 100) / 100;
    const city = random(cities);
    const lat = city.lat + (Math.random() - 0.5) * 0.1;
    const lng = city.lng + (Math.random() - 0.5) * 0.1;
    // Generate a random DOB between 1950-01-01 and 1990-12-31
    const start = new Date(1950, 0, 1).getTime();
    const end = new Date(1990, 11, 31).getTime();
    const dob = new Date(start + Math.random() * (end - start))
      .toISOString()
      .slice(0, 10);
    return {
      name,
      id,
      accountNumber,
      salary,
      dob,
      risk: Math.floor(Math.random() * 101),
      location: {
        city: city.city,
        coords: { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) },
      },
    };
  });
}
