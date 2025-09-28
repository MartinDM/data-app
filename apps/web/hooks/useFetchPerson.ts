import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { Person } from '../../app/types/person';

/**
 * Custom hook to provide person data fetching functionality from a TanStack table
 * @param table - TanStack Table instance containing Person data
 * @returns Object with fetchPersonById function
 */
export function useFetchPerson<TData extends Person>(table: Table<TData>) {
  const fetchPersonById = useMemo(() => {
    return (id: string): Person | undefined => {
      const row = table
        .getRowModel()
        .rows.find((row) => row.original.id === id);
      return row?.original as Person;
    };
  }, [table]);

  return {
    fetchPersonById,
  };
}

/**
 * Alternative hook for API-based person fetching
 * Use this when you want to fetch from a REST API or GraphQL endpoint
 */
export function useFetchPersonFromApi() {
  const fetchPersonById = useMemo(() => {
    return async (id: string): Promise<Person | undefined> => {
      try {
        // TODO: Replace with actual API endpoint
        const response = await fetch(`/api/people/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch person with id: ${id}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch person:', error);
        return undefined;
      }
    };
  }, []);

  return {
    fetchPersonById,
  };
}
