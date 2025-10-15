import * as React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Person } from '@/app/types/person';
import { useTable } from '@/contexts/TableContext';
import { DataTableToolbar } from './data-table-toolbar';
import { DobForm, DateRange } from '@/components/DobForm/DobForm';
import { createPeople } from '@/app/utils/helpers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { flexRender } from '@tanstack/react-table';

export function DataTable() {
  const { table, valsHidden, setValsHidden, setData } = useTable<Person>();
  const [dateRange, setDateRange] = useState<DateRange>({});

  useEffect(() => {
    const people = createPeople(100);
    if (dateRange.from && dateRange.to) {
      const from = format(dateRange.from, 'yyyy-MM-dd');
      const to = format(dateRange.to, 'yyyy-MM-dd');
      const filtered = people.filter((p) => p.dob >= from && p.dob <= to);
      setData(filtered);
    } else {
      setData(people);
    }
  }, [dateRange, setData]);

  const selectedCount = table.getSelectedRowModel().rows.length;

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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
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
