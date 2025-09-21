'use client';
import { useEffect, useState, useMemo } from 'react';
import * as React from 'react';
import { Person } from '../types/person';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { DataTableToolbar } from './data-table-toolbar';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { cn } from '@workspace/ui/lib/utils';
import { FormSchema } from '../../app/utils';
import { getColumns } from '../../components/DataTable/columns';

interface DataTableProps {
  allUsers: Person[];
}

export function DataTable({ allUsers }: DataTableProps) {
  // State for filtered users and date range
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [valsHidden, setValsHidden] = useState(false);

  const columns = getColumns(valsHidden);
  const users = useMemo(() => {
    if (dateRange.from && dateRange.to) {
      const from = format(dateRange.from, 'yyyy-MM-dd');
      const to = format(dateRange.to, 'yyyy-MM-dd');
      return allUsers
        .filter((user) => user.dob >= from && user.dob <= to)
        .sort((a, b) => a.dob.localeCompare(b.dob));
    }
    return allUsers;
  }, [dateRange, allUsers]);

  const onSubmit = (data: { dob: { from?: Date; to?: Date } }) => {
    setDateRange({ from: data.dob.from, to: data.dob.to });
  };

  // Form for date range selection
  const form = useForm<{
    dob: { from?: Date; to?: Date };
  }>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: { from: undefined, to: undefined },
    },
  });

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleReset = () => {
    form.reset();
    setDateRange({});
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mb-5">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex font-bold items-center flex-col">
                <h1>Filter by date DOB range</h1>
                <FormLabel>
                  {' '}
                  A list of customers born between two dates.
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3  mx-auto font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value && field.value.from ? (
                          field.value.to ? (
                            `${format(field.value.from, 'PPP')} - ${format(field.value.to, 'PPP')}`
                          ) : (
                            format(field.value.from, 'PPP')
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                        <FaRegCalendarAlt className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center gap-5 mb-4">
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
      <p className="text-right text-xs font-bold">
        Found {table.getFilteredRowModel().rows.length} results
      </p>
      <div className="flex items-center py-4">
        <DataTableToolbar
          valsHidden={valsHidden}
          setValsHidden={setValsHidden}
          table={table}
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
