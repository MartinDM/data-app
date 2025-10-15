'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Person } from '../../types/person';
import { MapPin } from 'lucide-react';
import { Map } from '../../../components/Map/Map';
import { Suspense } from 'react';
import { fetchPersonById, getAddressFromPos } from '@/utils/helpers';
import { useTable } from '@/contexts/TableContext';

const MapLoading = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-4">
    <MapPin className="size-8 animate-spin text-muted-foreground" />
    <p className="text-muted-foreground">Loading map...</p>
  </div>
);
export default function MapPage() {
  const personId = useParams().id;
  const { table } = useTable<Person>();
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      if (personId && fetchPersonById) {
        console.log('Person ID from params:', personId);
        setLoading(true);
        setError(null);
        try {
          const personData = fetchPersonById(
            table.getCoreRowModel().rows.map((r) => r.original),
            Number(personId),
          );

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
  }, []);

  return (
    <div className="h-screen w-full">
      <div className="mb-4 p-4">
        <h1 className="text-3xl font-bold">Location Map</h1>
        {person && <p> Last known location of {person ? person.name : 'this person'}</p>}
        <p className="text-muted-foreground">
          <MapPin />
          View location insights and history
        </p>
      </div>

      <Suspense fallback={<MapLoading />}>
        <div className="h-full w-full">
          {person && !loading && <Map locationData={person.locationInsights} />}{' '}
        </div>
      </Suspense>
    </div>
  );
}
