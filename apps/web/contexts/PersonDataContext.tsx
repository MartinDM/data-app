'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Table } from '@tanstack/react-table';
import { type Person } from '../app/types/person';

interface PersonDataContextType {
  fetchPersonById: (id: string) => Person | undefined;
  table: Table<Person>;
}

const PersonDataContext = createContext<PersonDataContextType | undefined>(undefined);

interface PersonDataProviderProps {
  children: ReactNode;
  table: Table<Person>;
}

export function usePersonData() {
  const context = useContext(PersonDataContext);
  if (context === undefined) {
    throw new Error('usePersonData must be used within a PersonDataProvider');
  }
  return context;
}

export function PersonDataProvider({ children, table }: PersonDataProviderProps) {
  const fetchPersonById = (id: string): Person | undefined => {
    const row = table.getRowModel().rows.find((row) => row.original.id === id);
    return row?.original as Person;
  };

  return (
    <PersonDataContext.Provider value={{ fetchPersonById, table }}>
      {children}
    </PersonDataContext.Provider>
  );
}
