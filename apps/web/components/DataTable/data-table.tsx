'use client';
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Person } from '../../app/types/person';
import { DataTableToolbar } from './data-table-toolbar';
import { DobForm } from '../DobForm/DobForm';
import {
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';

import { format } from 'date-fns';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { cn } from '@workspace/ui/lib/utils';
import { getColumns } from '../../components/DataTable/columns';

interface DataTableProps {
  allUsers: Person[];
}

export function DataTable({ allUsers }: DataTableProps) {
  // State for filtered users and date range
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [valsHidden, setValsHidden] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

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

  const columns = getColumns(valsHidden);

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedPeopleIds = selectedRows.map((row) => row.original.id);
    setSelectedCount(selectedPeopleIds.length);
  }, [table, rowSelection]);

  return (
    <div className="w-full">
      <DobForm dateRange={dateRange} setDateRange={setDateRange} />
      <p className="text-right text-xs font-bold">
        Found {table.getFilteredRowModel().rows.length} results
      </p>

      <p className="text-right text-sm font-semibold text-zinc-200 mb-2">
        {selectedCount} selected
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
