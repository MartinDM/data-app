'use client';
import { useState, useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import {
  Settings2,
  Globe,
  Eye,
  EyeOff,
  User,
  Users,
  BarChart3,
  MapPin,
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
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Person } from '../../app/types/person';
import { ProfileModal } from '../Modals/ProfileModal';
import { LocationInsightsModal } from '../Modals';
import { MapModal } from '../Modals/MapModal';

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
  const [openInsights, setOpenInsights] = useState<boolean>(false);
  const [openPersonModal, setOpenPersonModal] = useState<boolean>(false);
  const [openLocationModal, setOpenLocationModal] = useState<boolean>(false);
  const [openMapModal, setOpenMapModal] = useState<boolean>(false);

  // Calculate selected data directly with memoization for better performance
  const rowSelection = table.getState().rowSelection;
  const { selectedCount, selectedIds } = useMemo(() => {
    const rows = table.getSelectedRowModel().rows;
    return {
      selectedCount: rows.length,
      selectedIds: rows.map((row) => (row.original as Person).id),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, rowSelection]);

  const handleValuesToggle = () => {
    setValsHidden(!valsHidden);
  };

  const handleLocationModal = () => {
    setOpenLocationModal(true);
  };

  const handleMapModal = () => {
    setOpenMapModal(true);
  };

  const handlePersonProfile = () => {
    setOpenPersonModal(true);
  };

  const handleGroupInsights = () => {
    // Placeholder for group insights functionality
    console.log('Group insights functionality not yet implemented');
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
        <Button disabled variant="outline" size="sm" className="h-8 border-dashed">
          <Settings2 />
          Insights (0)
        </Button>
      ) : (
        <DropdownMenu open={openInsights} onOpenChange={setOpenInsights}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <BarChart3 className="h-4 w-4" />
              Insights ({selectedCount})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start">
            {selectedCount === 1 ? (
              <>
                <DropdownMenuLabel className="flex items-center gap-2 bg-[var(--group-header)]">
                  <User className="h-4 w-4" />
                  Individual Insights
                </DropdownMenuLabel>
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
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleMapModal();
                    }}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Map Visualiser
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
                  <Users className="h-4 w-4 bg-[var(--group-header)]" />
                  Group Insights ({selectedCount} people)
                </DropdownMenuLabel>
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

      {selectedIds[0] && (
        <>
          <ProfileModal
            isOpen={openPersonModal}
            onOpenChange={setOpenPersonModal}
            personId={selectedIds[0]}
          />

          <LocationInsightsModal
            isOpen={openLocationModal}
            onOpenChange={setOpenLocationModal}
            personId={selectedIds[0]}
          />

          <MapModal
            isOpen={openMapModal}
            onOpenChange={setOpenMapModal}
            personId={selectedIds[0]}
          />
        </>
      )}
    </div>
  );
}
