// src/utils/GeofenceMath.ts

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'danger' | 'info' | 'habitat';
  alertMessage: string;
  expectedWildlife: string;
  polygon: Coordinate[];
  audioAutoPlay?: boolean; // Add this line!
}

/**
 * Ray-Casting Algorithm to determine if a point is inside a polygon.
 */
export function isPointInPolygon(point: Coordinate, polygon: Coordinate[]): boolean {
  let isInside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;
    
    // Check if the ray crosses the edge
    const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
        (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
        
    if (intersect) isInside = !isInside;
  }
  
  return isInside;
}