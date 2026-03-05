// src/services/AnimalService.ts

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Interface for your Animal Data
export interface AnimalData {
  name: { en: string; si: string; ta: string };
  description: { en: string };
  audioUrl: string;
  status: string;
}

/**
 * Fetches animal details based on the AI Class Index.
 * Tries cache first (offline), then network.
 */
export const fetchAnimalInfo = async (classIndex: number): Promise<AnimalData | null> => {
  try {
    const q = query(collection(db, 'animals'), where('id', '==', classIndex));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as AnimalData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching animal data:", error);
    return null;
  }
};