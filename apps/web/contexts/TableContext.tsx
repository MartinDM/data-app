'use client';

import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  Table,
} from '@tanstack/react-table';
import { createPeople } from '../../web/app/utils/helpers';
import { getColumns } from '../../web/components/DataTable/columns';

type TableContextType<TData> = {
  table: Table<TData>;
  valsHidden: boolean;
  setValsHidden: (value: boolean) => void;
};

const TableContext = createContext<TableContextType<any> | undefined>(undefined);

export function TableProvider<TData>({ children }: { children: ReactNode }) {
  const [data] = useState<TData[]>(() => createPeople(100) as TData[]);

  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [valsHidden, setValsHidden] = useState(false);

  const columns = useMemo(() => getColumns(valsHidden), [valsHidden]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection: true,
    initialState: { pagination: { pageSize: 50 } },
  });

  const value = useMemo(
    () => ({ table, valsHidden, setValsHidden, data, setData }),
    [table, valsHidden, data],
  );

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTable<TData>() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTable must be used within a TableProvider');
  return ctx as TableContextType<TData>;
}
