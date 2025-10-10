'use client';
import { ColumnDef, Table, Row, Column } from '@tanstack/react-table';
import { Person } from '../../app/types/person';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';

const getRiskByScore = (risk: number) => {
  if (risk < 33) return 'Low';
  if (risk < 66) return 'Medium';
  return 'High';
};

export const getColumns = (valsHidden: boolean): ColumnDef<Person>[] => [
  {
    id: 'select',
    header: ({ table }: { table: Table<Person> }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] m-2"
      />
    ),
    cell: ({ row }: { row: Row<Person> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] m-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }: { column: Column<Person> }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }: { row: Row<Person> }) => {
      const id = row.getValue('id') as string;
      return <div className="font-medium">{id}</div>;
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'name',
    header: ({ column }: { column: Column<Person> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }: { row: Row<Person> }) => {
      return <div className={'font-medium'}>{row.getValue('name')}</div>;
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'risk',
    header: ({ column }: { column: Column<Person> }) => (
      <DataTableColumnHeader column={column} title="Risk" />
    ),
    cell: ({ row }: { row: Row<Person> }) => {
      const riskScore = row.getValue('risk') as number;
      const risk = getRiskByScore(riskScore);
      const riskColor =
        risk === 'Low'
          ? 'text-green-500'
          : risk === 'Medium'
            ? 'text-yellow-500'
            : 'text-red-500';
      return <div className={riskColor + ' font-medium'}>{riskScore}</div>;
    },
    sortingFn: 'alphanumeric',
    filterFn: (row, id, value) => {
      return value.includes(getRiskByScore(row.getValue(id) as number));
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }: { column: Column<Person> }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }: { row: Row<Person> }) => {
      const location = row.getValue('location') as Person['location'];
      return (
        <div className="font-medium">
          {location.city}, {location.coords.lat}, {location.coords.lng}
        </div>
      );
    },
    filterFn: (row: Row<Person>, id: string, value: string[]) => {
      return value.includes((row.getValue(id) as Person['location']).city);
    },
  },
  {
    accessorKey: 'salary',
    header: ({ column }: { column: Column<Person> }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }: { row: Row<Person> }) => {
      if (valsHidden) return '---';
      const salary = parseFloat(row.getValue('salary'));
      const formatted = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
      }).format(salary);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'accountNumber',
    header: ({ column }: { column: Column<Person> }) => (
      <DataTableColumnHeader column={column} title="Account Number" />
    ),
    cell: ({ row }: { row: Row<Person> }) => {
      const accountNumber = row.getValue('accountNumber') as string;
      return <div className="font-medium">{accountNumber}</div>;
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'dob',
    header: ({ column }: { column: Column<Person> }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }: { row: Row<Person> }) => {
      const dob = row.getValue('dob') as string;
      return <div className="font-medium">{dob}</div>;
    },
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    cell: ({ row }: { row: Row<Person> }) => <DataTableRowActions row={row} />,
  },
  {
    id: 'bio',
    accessorKey: 'bio',
    enableSorting: false,
    header: ({ column }: { column: Column<Person> }) => (
      <DataTableColumnHeader column={column} disableSorting title="Bio" />
    ),
    cell: ({ row }: { row: Row<Person> }) => {
      const bio = row.getValue('bio') as string;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info />
          </TooltipTrigger>
          <TooltipContent>
            <p>{bio}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
];
