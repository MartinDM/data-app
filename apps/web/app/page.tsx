import React from 'react';
import { DataTable } from '../components/DataTable/data-table';
import { createPeople } from './utils/helpers';
import { Person } from './types/person';

async function getData(): Promise<Person[]> {
  return createPeople(100);
}

export default async function DataPage() {
  const allUsers = await getData();
  return (
    <div className="flex flex-col items-center justify-center p-5 pt-0">
      <DataTable allUsers={allUsers} />
    </div>
  );
}
