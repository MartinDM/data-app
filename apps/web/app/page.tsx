import React from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { DataTable } from '../components/DataTable/data-table';
import { generateUsers } from './utils/generateUsers';
import { Person } from '../types/person';

async function getData(): Promise<Person[]> {
  return generateUsers();
}

export default async function DataPage() {
  const allUsers = await getData();
  return (
    <div className="flex flex-col items-center justify-center p-5 pt-0">
      <DataTable allUsers={allUsers} />
    </div>
  );
}
