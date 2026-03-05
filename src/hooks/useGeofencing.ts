// src/hooks/useGeofencing.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { isPointInPolygon, GeofenceZone } from '../utils/GeofenceMath';

// Mock Data representing a zone in Yala National Park
const YALA_ZONES: GeofenceZone[] = [
  {
    id: 'zone_01',
    name: 'Carnivore Zone',
    type: 'danger',
    alertMessage: 'High probability of Sri Lankan leopard sightings. Keep all windows and doors closed.',
    expectedWildlife: 'Sri Lankan leopard',
    polygon: [
      { lat: 6.354, lng: 81.521 },
      { lat: 6.358, lng: 81.521 },
      { lat: 6.358, lng: 81.525 },
      { lat: 6.354, lng: 81.525 }
    ]
  }
];

export function useGeofencing() {
  const [currentZone, setCurrentZone] = useState<GeofenceZone | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscriber: Location.LocationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Watch position updates continuously
      locationSubscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation);
          
          const currentPoint = {
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude
          };

          // Check if the user is inside any defined zone
          let foundZone = null;
          for (const zone of YALA_ZONES) {
            if (isPointInPolygon(currentPoint, zone.polygon)) {
              foundZone = zone;
              break;
            }
          }
          
          setCurrentZone(foundZone);
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscriber) {
        locationSubscriber.remove();
      }
    };
  }, []);

  return { location, currentZone, errorMsg };
}