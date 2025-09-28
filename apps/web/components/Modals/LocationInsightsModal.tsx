'use client';
import { useState, useEffect } from 'react';
import { Person } from '../../app/types/person';
import { MapPin, Calendar, CreditCard, Loader2, Globe } from 'lucide-react';
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
  fetchPersonById: (id: string) => Person | undefined;
}

export function LocationInsightsModal({
  isOpen,
  onOpenChange,
  personId,
  fetchPersonById,
}: LocationInsightsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [person, setPerson] = useState<Person | null>(null);
  const [locationData, setLocationData] = useState<
    Person['locationInsights'] | null
  >(null);

  useEffect(() => {
    if (isOpen && personId && fetchPersonById) {
      setLoading(true);
      setError(null);
      try {
        const personData = fetchPersonById(personId);
        setPerson(personData || null);
        if (!personData) {
          setError('Person not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load person data');
        setLoading(false);
      }
    }
  }, [isOpen, personId, fetchPersonById]);

  useEffect(() => {
    const locationData = person?.locationInsights || null;
    setLocationData(locationData);
  }, [person]);

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') return date;
    return date.toLocaleDateString();
  };

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
            Visualise the data we have for{' '}
            {person ? person.name : 'this person'}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading person data...
            </div>
          )}

          {error && (
            <div className="text-destructive text-center py-4">{error}</div>
          )}

          {person && !loading && (
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">
                  Basic Information
                </h3>
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

              {person.locationInsights && (
                <section>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Insights
                  </h3>
                </section>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
