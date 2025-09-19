import React from 'react';
import { type DateRange } from 'react-day-picker';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { format } from 'date-fns';
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from 'lucide-react';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { cn } from '@workspace/ui/lib/utils';
import { Navbar } from '../../components/navbar';
import { columns, Payment } from '../../components/DataTable/columns';
import { DataTable } from '../../components/DataTable/data-table';
import { generateUsers } from '../utils/generateUsers';
import { Person } from '../types/person';

async function getData(): Promise<Person[]> {
  // Replace this with a real API/database call if needed
  return generateUsers();
}

export default async function DataPage() {
  const allUsers = await getData();
  return (
    <div className="bg-black flex flex-col items-center justify-center p-5 pt-0">
      <DataTable columns={columns} allUsers={allUsers} />
    </div>
  );
}
