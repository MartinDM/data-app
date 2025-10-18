'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { DataTableViewOptions } from './data-table-view-options';

import { risk } from '../../data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { usePeople } from "@/contexts/PeopleContext";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  valsHidden: boolean;
  setValsHidden: (hidden: boolean) => void;
}

export function DataTableToolbar<TData>({
  table,
  valsHidden,
  setValsHidden,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const riskColumn = table.getColumn('risk');
  const { refresh } = usePeople()
  return (
    <div className="flex items-center space-between">
      <div className="flex flex-1 items-center space-x-2 mr-2">
        <Input
          placeholder="Filter people..."
          value={(table?.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table?.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {riskColumn && (
          <DataTableFacetedFilter column={riskColumn} title="Risk" options={risk} />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 border-dashed"
          >
            Reset
            <X />
          </Button>
        )}
        <Button onClick={() => {
          refresh();
          table.resetRowSelection(); // optional
        }}>Refresh Data</Button>
      </div>
      <DataTableViewOptions
        setValsHidden={setValsHidden}
        valsHidden={valsHidden}
        table={table}
      />
    </div>
  );
}
