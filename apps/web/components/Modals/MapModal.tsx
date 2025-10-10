'use client';
import { useState, useEffect } from 'react';
import { Person } from '../../app/types/person';
import { MapPin, Loader2 } from 'lucide-react';
import { Map } from '../Map/Map';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';

import { usePersonData } from '../../contexts/PersonDataContext';
import { getAddressFromPos } from '../../app/utils/helpers';

interface MapModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  personId: string;
}

export function MapModal({ isOpen, onOpenChange, personId }: MapModalProps) {
  const { fetchPersonById } = usePersonData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [person, setPerson] = useState<Person | null>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (isOpen && personId && fetchPersonById) {
        setLoading(true);
        setError(null);
        try {
          const personData = fetchPersonById(personId);
          console.log(personData);
          setPerson(personData);
          if (!personData) {
            setError('Person not found');
          }
          const { lng, lat } = personData?.locationInsights.currentLocation.coords || {
            lng: 0,
            lat: 0,
          };
          const geoCodeResponse = await getAddressFromPos({ lng, lat });
          const feature = geoCodeResponse.features[0];
          const street =
            feature?.properties.context.street?.name ||
            feature?.properties.context.address?.name;
          const postcode = feature?.properties.context.postcode?.name;
          const country = feature?.properties.context.country?.name;
          const addressParts = [street, postcode, country].filter(Boolean);
          setAddress(addressParts.join(', ') || 'Address not found');
          setLoading(false);
        } catch (e) {
          console.log(e);
          setError('Failed to load person data');
          setLoading(false);
        }
      }
    })();
  }, [isOpen, personId, fetchPersonById]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] pb-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin />
            {loading
              ? 'Loading Map...'
              : person
                ? `${person.name} - Map Visualiser`
                : 'Visualiser'}
          </DialogTitle>
          <DialogDescription>
            Last known location of {person ? person.name : 'this person'}
            <span className="block">{address}</span>
          </DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading person data...
          </div>
        )}

        {error && <div className="text-destructive text-center py-4">{error}</div>}

        {person && !loading && <Map locationData={person.locationInsights} />}
      </DialogContent>
    </Dialog>
  );
}
