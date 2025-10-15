import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Legend } from './components/Legend';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { LocationInsights } from '../../app/types/person';
import {
  createResidencePopupHTML,
  createLocationPopupHTML,
  createCurrentLocationPopupHTML,
  generateCurrentLocationMarker,
  generateResidenceMarker,
  generateLocationMarker,
} from './helpers';

import { Lightbulb, LightbulbOff } from 'lucide-react';

export function Map({ locationData }: { locationData: LocationInsights }) {
  const { lat, lng } = locationData?.currentLocation?.coords || { lat: 0, lng: 0 };

  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>();

  const [zoom, setZoom] = useState(14.5);
  const [center, setCenter] = useState<[number, number]>([lng, lat]);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const [isDark, setIsDark] = useState(false);

  const [showResidenceHistory, setShowResidenceHistory] = useState(true);
  const [showLocationHistory, setShowLocationHistory] = useState(true);

  useEffect(() => {
    if (!mapContainerRef.current || !locationData?.currentLocation?.coords) {
      return;
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center,
      zoom,
    });

    // Add current location marker (always visible)
    if (locationData?.currentLocation) {
      const { lng, lat } = locationData.currentLocation.coords;
      const markerEl = generateCurrentLocationMarker();
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        createCurrentLocationPopupHTML(locationData.currentLocation),
      );
      new mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current);
    }

    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate effect for managing residence history markers
  useEffect(() => {
    if (!mapRef.current || !locationData?.residenceHistory) return;

    const markers: mapboxgl.Marker[] = [];

    if (showResidenceHistory) {
      console.log('Adding residence history markers');
      locationData.residenceHistory.forEach((residence) => {
        const { lng, lat } = residence.location.coords;
        const markerEl = generateResidenceMarker(!residence.endDate);
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          createResidencePopupHTML(residence),
        );
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current);
        markers.push(marker);
      });
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [showResidenceHistory, locationData?.residenceHistory]);

  useEffect(() => {
    if (!mapRef.current || !locationData?.locationHistory) return;

    const markers: mapboxgl.Marker[] = [];

    if (showLocationHistory) {
      console.log('Adding location history markers');
      locationData.locationHistory.forEach((location) => {
        const { lng, lat } = location.location.coords;
        const markerEl = generateLocationMarker(location);
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          createLocationPopupHTML(location),
        );
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current);
        markers.push(marker);
      });
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [showLocationHistory, locationData?.locationHistory]);

  const changeStyle = (newStyle: string) => {
    if (mapRef.current) {
      setMapStyle(newStyle);
      mapRef.current.setStyle(newStyle);
    }
  };

  const toggleStyle = () => {
    const newStyle = isDark
      ? 'mapbox://styles/mapbox/streets-v12'
      : 'mapbox://styles/mapbox/navigation-night-v1';

    setIsDark(!isDark);
    changeStyle(newStyle);
  };

  const handleReset = () => {
    mapRef?.current.flyTo({
      center: [lng, lat],
      zoom: 14.5,
    });
  };

  return (
    <div className={`relative h-full w-full flex-1`}>
      <div ref={mapContainerRef} className={`h-full w-full`} />
      <div
        className={`absolute top-0 left-0 m-3 px-3 py-1.5 bg-slate-700/90 text-white font-mono rounded z-10`}
      >
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom:{' '}
        {zoom.toFixed(2)}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 w-full flex justify-between items-end p-4 z-10`}
      >
        <Legend
          showResidenceHistory={showResidenceHistory}
          showLocationHistory={showLocationHistory}
          onToggleResidenceHistory={() => setShowResidenceHistory(!showResidenceHistory)}
          onToggleLocationHistory={() => setShowLocationHistory(!showLocationHistory)}
        />
        <div className={`flex gap-2`}>
          <button
            className={`bg-gray-800 py-2 px-4 text-white rounded hover:bg-gray-700 transition-colors`}
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className={`bg-gray-800 py-2 px-4 text-white rounded hover:bg-gray-700 transition-colors`}
            onClick={toggleStyle}
          >
            {isDark ? <LightbulbOff /> : <Lightbulb />}
          </button>
        </div>
      </div>
    </div>
  );
}
