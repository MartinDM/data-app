'use client';
import { Globe, MapPin } from 'lucide-react';
import { type Person } from '../../app/types/person';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';
import { fetchPersonById, formatCurrency } from '@/utils/helpers';
import { usePeople } from "@/contexts/PeopleContext";

interface LocationInsightsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  personId: string;
}


export function LocationInsightsModal({
  isOpen,
  onOpenChange,
  personId,
}: LocationInsightsModalProps) {

  const { people } = usePeople()
  const person = fetchPersonById(people, personId);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
          </DialogTitle>
          <DialogDescription>
            Visualise the data we have for {person ? person.name : 'this person'}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">

          {person && (
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="text-sm">{person.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </label>
                    <p className="text-sm">{person.dob}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Number
                    </label>
                    <p className="text-sm font-mono">{person.accountNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Salary
                    </label>
                    <p className="text-sm">{formatCurrency(person.salary)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Current Location
                    </label>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {person.location.city}
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {person.locationInsights?.currentLocation?.coords?.lat && (
                <section>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Insights
                  </h3>

                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-3">Interactive Map</h4>
                  </div>

                  {/* Location Statistics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Risk Indicators
                      </label>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Avg. Stay Duration
                      </label>
                      <p className="text-lg font-semibold">
                        {person.locationInsights?.locationHistory?.length > 0
                          ? Math.round(
                            person.locationInsights.locationHistory.reduce(
                              (acc, loc) => acc + (loc.duration || 0),
                              0,
                            ) / person.locationInsights.locationHistory.length,
                          )
                          : 0}{' '}
                        days
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
