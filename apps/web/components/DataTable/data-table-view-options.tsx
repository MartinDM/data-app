'use client';
import { useEffect, useState } from 'react';
import { Table } from '@tanstack/react-table';
import {
  Settings2,
  Globe,
  History,
  Eye,
  EyeOff,
  User,
  Users,
  BarChart3,
  MapPin,
  PoundSterling,
  Calendar,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { ActionType } from '../../app/types/enums';
import { Person } from '../../app/types/person';
import { ProfileModal } from '../Modals/ProfileModal';
import { useFetchPerson } from '../../hooks/useFetchPerson';
import { LocationInsightsModal } from '../Modals';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  valsHidden: boolean;
  setValsHidden: (hidden: boolean) => void;
}

export function DataTableViewOptions<TData>({
  table,
  setValsHidden,
  valsHidden,
}: DataTableViewOptionsProps<TData>) {
  const { fetchPersonById } = useFetchPerson(table as Table<Person>);

  const handleValuesToggle = () => {
    setValsHidden(!valsHidden);
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openInsights, setOpenInsights] = useState(false);
  const [openPersonModal, setOpenPersonModal] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [openLocationModal, setOpenLocationModal] = useState(false);

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    setSelectedIds(selectedIds);
  }, [table.getState().rowSelection]);

  // const handleIndividualInsights = (personId: string, action?: ActionType) => {
  //   const personData: Person = table
  //     .getSelectedRowModel()
  //     .rows.find((row) => row.original.id === personId)?.original;
  //   setOpenInsights(false);
  // };

  // const handleGroupInsights = () => {
  //   const selectedRows = table.getSelectedRowModel().rows;
  //   const selectedPeople = selectedRows.map((row) => row.original);
  //   // Navigate
  //   setOpenInsights(false);
  // };

  const handleLocationModal = () => {
    setOpenLocationModal(true);
    setSelectedPersonId(selectedIds[0]);
  };

  const handlePersonProfile = () => {
    setOpenPersonModal(true);
    setSelectedPersonId(selectedIds[0]);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleValuesToggle}
        variant="outline"
        size="sm"
        className="h-8 border-dashed"
      >
        {valsHidden ? <EyeOff /> : <Eye />}
        {valsHidden ? 'Show values' : 'Hide values'}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <Settings2 />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => column.accessorFn && column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedIds.length === 0 ? (
        <Button
          disabled
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <Settings2 />
          Insights (0)
        </Button>
      ) : (
        <DropdownMenu open={openInsights} onOpenChange={setOpenInsights}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <BarChart3 className="h-4 w-4" />
              Insights ({selectedIds.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start">
            {selectedIds.length === 1 ? (
              <>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Individual Insights
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleLocationModal();
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Location History
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PoundSterling className="mr-2 h-4 w-4" />
                    Transaction history
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Work
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handlePersonProfile();
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Profile
                </DropdownMenuItem>
              </>
            ) : (
              // Multiple people selected - show group insights
              <>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Group Insights ({selectedIds.length} people)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleGroupInsights}>
                    <Globe className="mr-2 h-4 w-4" />
                    Geographic Distribution
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGroupInsights}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Demographic Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGroupInsights}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Comparative Metrics
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleGroupInsights}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Group Report
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <ProfileModal
        isOpen={openPersonModal}
        onOpenChange={setOpenPersonModal}
        personId={selectedPersonId}
        fetchPersonById={fetchPersonById}
      />

      <LocationInsightsModal
        isOpen={openLocationModal}
        onOpenChange={setOpenLocationModal}
        personId={selectedPersonId}
        fetchPersonById={fetchPersonById}
      />
    </div>
  );
}
