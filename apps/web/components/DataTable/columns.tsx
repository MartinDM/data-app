'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Person } from '../../app/types/person';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
export const columns: ColumnDef<Person>[] = [
  {
    id: 'select',
    header: ({ table }) => (
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
    cell: ({ row }) => (
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return <div className="font-medium">{id}</div>;
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <div className={'font-medium'}>{row.getValue('name')}</div>;
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'risk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Risk" />
    ),
    cell: ({ row }) => {
      const risk = row.getValue('risk');
      const riskLevel = risk < 33 ? 'Low' : risk < 66 ? 'Medium' : 'High';
      const riskColor =
        riskLevel === 'Low'
          ? 'text-green-500'
          : riskLevel === 'Medium'
            ? 'text-yellow-500'
            : 'text-red-500';
      return <div className={riskColor + ' font-medium'}>{riskLevel}</div>;
    },
    sortingFn: 'alphanumeric',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const location = row.getValue('location');
      return (
        <div className="font-medium">
          {location.city}, {location.coords.lat}, {location.coords.lng}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id).city);
    },
  },
  {
    accessorKey: 'salary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Number" />
    ),
    cell: ({ row }) => {
      const accountNumber = row.getValue('accountNumber') as string;
      return <div className="font-medium">{accountNumber}</div>;
    },
    sortingFn: 'number',
  },
  {
    accessorKey: 'dob',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => {
      const dob = row.getValue('dob') as string;
      return <div className="font-medium">{dob}</div>;
    },
    sortingFn: 'datetime',
  },
];
