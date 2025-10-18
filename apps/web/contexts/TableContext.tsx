'use client';

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { Person } from '@/app/types/person';
import { DateRange } from '@/components/DobForm/DobForm';
import {
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  Table,
} from '@tanstack/react-table';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getColumns } from '../../web/components/DataTable/columns';
import { usePeople } from "./PeopleContext";

type TableContextType = {
  table: Table<Person>;
  valsHidden: boolean;
  setValsHidden: (value: boolean) => void;
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
};
const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const { people: data } = usePeople();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [valsHidden, setValsHidden] = useState(false);

  const columns = useMemo(() => getColumns(valsHidden), [valsHidden]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Register table methods
  const table = useReactTable<Person>({
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

  // Apply date range filter to DOB column when dateRange changes
  useEffect(() => {
    const col = table.getColumn('dob');
    if (!col) return;
    if (dateRange.from || dateRange.to) {
      col.setFilterValue({ from: dateRange.from, to: dateRange.to });
    } else {
      col.setFilterValue(undefined);
    }
  }, [dateRange, table]);

  const value = useMemo(
    () => ({ table, valsHidden, setValsHidden, dateRange, setDateRange }),
    [table, valsHidden, dateRange],
  );

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTable() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTable must be used within a TableProvider');
  return ctx;
}
