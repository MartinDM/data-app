import {
  Person,
  CreditCardTransaction,
  LocationHistoryEntry,
  LocationInsights,
  TransactionInsights,
} from '../types/person';

import { faker } from '@faker-js/faker';
import { MapLocation } from '../types/map';
const merchantCategories = [
  'grocery',
  'gas',
  'restaurant',
  'retail',
  'travel',
  'entertainment',
  'healthcare',
  'utilities',
  'other',
] as const;
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'JPY'] as const;
const transactionTypes = ['purchase', 'refund', 'withdrawal', 'fee'] as const;
const transactionStatuses = [
  'completed',
  'pending',
  'declined',
  'disputed',
] as const;
const confidenceLevels = ['high', 'medium', 'low'] as const;
const sources = [
  'gps',
  'check-in',
  'transaction',
  'survey',
  'inferred',
] as const;
const locationTypes = [
  'residence',
  'work',
  'travel',
  'visit',
  'other',
] as const;
const residenceTypes = ['primary', 'secondary', 'temporary'] as const;

function generateCreditCardTransaction(): CreditCardTransaction {
  const isOnline = faker.datatype.boolean();
  const merchantCategory = faker.helpers.arrayElement(merchantCategories);

  return {
    id: faker.string.uuid(),
    timestamp: faker.date.recent({ days: 180 }), // Last 6 months
    amount: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
    currency: faker.helpers.arrayElement(currencies),
    merchantName: faker.company.name(),
    merchantCategory,
    location: isOnline
      ? undefined
      : {
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          coords: {
            lat: parseFloat(faker.location.latitude()),
            lng: parseFloat(faker.location.longitude()),
          },
          address: faker.location.streetAddress(),
        },
    cardLastFour: faker.finance.creditCardNumber().slice(-4),
    transactionType: faker.helpers.arrayElement(transactionTypes),
    isOnline,
    status: faker.helpers.arrayElement(transactionStatuses),
    description: faker.lorem.sentence(),
  };
}

function generateLocationHistoryEntry(): LocationHistoryEntry {
  return {
    id: faker.string.uuid(),
    timestamp: faker.date.past({ years: 2 }),
    location: {
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      coords: {
        lat: parseFloat(faker.location.latitude()),
        lng: parseFloat(faker.location.longitude()),
      },
      address: faker.location.streetAddress(),
      postalCode: faker.location.zipCode(),
    },
    type: faker.helpers.arrayElement(locationTypes),
    duration: faker.number.int({ min: 1, max: 365 }),
    confidence: faker.helpers.arrayElement(confidenceLevels),
    source: faker.helpers.arrayElement(sources),
    notes: faker.lorem.sentence(),
  };
}

function generateTransactionInsights(
  transactions: CreditCardTransaction[],
): TransactionInsights {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const transactionCount = transactions.length;

  // Generate category breakdown
  const categoryBreakdown: Record<
    string,
    { amount: number; percentage: number; transactionCount: number }
  > = {};
  merchantCategories.forEach((category) => {
    const categoryTransactions = transactions.filter(
      (t) => t.merchantCategory === category,
    );
    const categoryAmount = categoryTransactions.reduce(
      (sum, t) => sum + t.amount,
      0,
    );
    categoryBreakdown[category] = {
      amount: categoryAmount,
      percentage: totalSpent > 0 ? (categoryAmount / totalSpent) * 100 : 0,
      transactionCount: categoryTransactions.length,
    };
  });

  // Generate monthly trends (last 6 months)
  const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthTransactions = transactions.filter(
      (t) =>
        t.timestamp.getMonth() === date.getMonth() &&
        t.timestamp.getFullYear() === date.getFullYear(),
    );
    return {
      month: date.toISOString().slice(0, 7), // YYYY-MM format
      totalSpent: monthTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactionCount: monthTransactions.length,
    };
  });

  // Generate location spending
  const locationMap = new Map<
    string,
    {
      city: string;
      country: string;
      totalSpent: number;
      transactionCount: number;
      lastTransaction: Date;
      coords?: { lat: number; lng: number };
    }
  >();
  transactions.forEach((t) => {
    if (t.location) {
      const key = `${t.location.city}, ${t.location.country}`;
      const existing = locationMap.get(key);
      if (existing) {
        existing.totalSpent += t.amount;
        existing.transactionCount++;
        if (t.timestamp > existing.lastTransaction) {
          existing.lastTransaction = t.timestamp;
        }
      } else {
        locationMap.set(key, {
          city: t.location.city,
          country: t.location.country,
          totalSpent: t.amount,
          transactionCount: 1,
          lastTransaction: t.timestamp,
          coords: t.location.coords,
        });
      }
    }
  });

  const foreignTransactions = transactions.filter(
    (t) => t.location?.country !== 'United States',
  ).length;
  const travelTransactions = transactions.filter(
    (t) => t.merchantCategory === 'travel',
  );
  const largeTransactions = transactions.filter((t) => t.amount > 200);

  return {
    recentTransactions: transactions,
    spendingPatterns: {
      totalSpent,
      averageTransaction:
        transactionCount > 0 ? totalSpent / transactionCount : 0,
      transactionCount,
      categoryBreakdown,
      monthlyTrends,
    },
    locationSpending: Array.from(locationMap.values()),
    travelIndicators: {
      foreignTransactions,
      uniqueLocations: locationMap.size,
      travelSpending: travelTransactions.reduce((sum, t) => sum + t.amount, 0),
      internationalSpending: transactions
        .filter((t) => t.location?.country !== 'United States')
        .reduce((sum, t) => sum + t.amount, 0),
    },
    riskIndicators: {
      unusualLocations: Array.from(locationMap.values())
        .slice(0, 3)
        .map((loc) => ({
          location: `${loc.city}, ${loc.country}`,
          date: loc.lastTransaction,
          amount: loc.totalSpent,
          riskScore: faker.number.int({ min: 0, max: 100 }),
        })),
      largeTransactions,
      frequentMerchants: Array.from({ length: 3 }, () => ({
        merchantName: faker.company.name(),
        transactionCount: faker.number.int({ min: 5, max: 20 }),
        totalSpent: faker.number.int({ min: 100, max: 1000 }),
      })),
    },
  };
}

function generateLocationInsights(): LocationInsights {
  const locationHistory = Array.from(
    { length: faker.number.int({ min: 5, max: 15 }) },
    () => generateLocationHistoryEntry(),
  );

  const frequentDestinations = Array.from(
    { length: faker.number.int({ min: 3, max: 8 }) },
    () => ({
      city: faker.location.city(),
      country: faker.location.country(),
      visitCount: faker.number.int({ min: 1, max: 10 }),
      lastVisit: faker.date.recent({ days: 365 }),
    }),
  );

  const residenceHistory = Array.from(
    { length: faker.number.int({ min: 2, max: 5 }) },
    (_, i) => {
      const startDate = faker.date.past({ years: 10 });
      const endDate =
        i === 0
          ? undefined
          : faker.date.between({ from: startDate, to: new Date() });

      return {
        location: {
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          coords: {
            lat: parseFloat(faker.location.latitude()),
            lng: parseFloat(faker.location.longitude()),
          },
        },
        startDate,
        endDate,
        residenceType: faker.helpers.arrayElement(residenceTypes),
      };
    },
  );

  const workLocations = Array.from(
    { length: faker.number.int({ min: 1, max: 4 }) },
    (_, i) => {
      const startDate = faker.date.past({ years: 5 });
      const endDate =
        i === 0
          ? undefined
          : faker.date.between({ from: startDate, to: new Date() });

      return {
        location: {
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          coords: {
            lat: parseFloat(faker.location.latitude()),
            lng: parseFloat(faker.location.longitude()),
          },
        },
        company: faker.company.name(),
        startDate,
        endDate,
        isRemote: faker.datatype.boolean(),
      };
    },
  );

  return {
    currentLocation: {
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      coords: {
        lat: parseFloat(faker.location.latitude()),
        lng: parseFloat(faker.location.longitude()),
      },
      since: faker.date.past({ years: 2 }),
    },
    locationHistory,
    travelPatterns: {
      frequentDestinations,
      mobilityScore: faker.number.int({ min: 0, max: 100 }),
      averageStayDuration: faker.number.int({ min: 30, max: 365 }),
      timeZoneChanges: faker.number.int({ min: 0, max: 20 }),
    },
    residenceHistory,
    workLocations,
  };
}

export function createPeople(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => {
    // Generate transactions first to calculate insights
    const transactions = Array.from(
      { length: faker.number.int({ min: 20, max: 100 }) },
      () => generateCreditCardTransaction(),
    );

    return {
      id: `U${(1000 + index).toString().padStart(4, '0')}`,
      name: faker.person.fullName(),
      risk: faker.number.int({ min: 0, max: 100 }),
      accountNumber: faker.finance.accountNumber(),
      salary: faker.number.int({ min: 30000, max: 120000 }),
      bio: faker.person.bio(),
      dob: faker.date.past({ years: 30 }).toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
      location: {
        city: faker.location.city(),
        coords: {
          lat: parseFloat(faker.location.latitude()),
          lng: parseFloat(faker.location.longitude()),
        },
      },
      locationInsights: generateLocationInsights(),
      transactionInsights: generateTransactionInsights(transactions),
    };
  });
}

export function mapDataFromPerson(person: Person): MapLocation[] {
  return [
    {
      id: person.id,
      type: 'home',
      coords: person.location.coords,
      title: `${person.name}'s Home`,
      description: `Home location of ${person.name}`,
      timestamp: new Date(),
    },
    {
      id: person.id,
      type: 'work',
      coords: person.location.coords,
      title: `${person.name}'s Work`,
      description: `Work location of ${person.name}`,
      timestamp: new Date(),
    },
  ];
}
