'use client';
import { useState, useEffect } from 'react';
import { Person } from '../../app/types/person';
import { MapPin, Loader2, Globe } from 'lucide-react';
import { fetchPersonById, getAddressFromPos } from '@/utils/helpers';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Separator } from '@workspace/ui/components/separator';
import { ScrollArea } from '@workspace/ui/components/scroll-area';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (isOpen && personId) {
      setLoading(true);
      setError(null);
      try {
        const personData = fetchPersonById(personId);
        console.log(personData);
        setPerson(personData || null);
        if (!personData) {
          setError('Person not found');
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError('Failed to load person data');
        setLoading(false);
      }
    }
  }, [isOpen, personId]);

  useEffect(() => {
    setPerson(person); // Ensure person state is updated
  }, [person]);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {loading
              ? 'Loading Map...'
              : person
                ? `${person.name} - Location Insights`
                : 'Visualiser'}
          </DialogTitle>
          <DialogDescription>
            Visualise the data we have for {person ? person.name : 'this person'}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading person data...
            </div>
          )}

          {error && <div className="text-destructive text-center py-4">{error}</div>}

          {person && !loading && (
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
                        Cities Visited
                      </label>
                      <p className="text-lg font-semibold">
                        {person.locationInsights?.citiesVisited || 0}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Travel Frequency
                      </label>
                      <p className="text-lg font-semibold">
                        {person.locationInsights?.travelFrequency || 'N/A'}
                      </p>
                    </div>
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
