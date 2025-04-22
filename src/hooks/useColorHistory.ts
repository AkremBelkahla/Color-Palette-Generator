import { useState, useEffect } from 'react';
import { SavedPalette } from '../types';

const STORAGE_KEY = 'color-palette-history';
const MAX_HISTORY = 12;

export const useColorHistory = () => {
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  
  // Load palettes from localStorage on initial render
  useEffect(() => {
    const loadPalettes = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (Array.isArray(parsedData)) {
            setSavedPalettes(parsedData);
          }
        }
      } catch (err) {
        console.error('Error loading palette history:', err);
      }
    };
    
    loadPalettes();
  }, []);
  
  // Save a new palette to history
  const savePalette = (palette: SavedPalette) => {
    // Create a new array with the new palette at the beginning
    const updatedPalettes = [palette, ...savedPalettes]
      // Limit the number of saved palettes
      .slice(0, MAX_HISTORY);
    
    // Update state
    setSavedPalettes(updatedPalettes);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPalettes));
    } catch (err) {
      console.error('Error saving palette to history:', err);
    }
  };
  
  // Clear all saved palettes
  const clearHistory = () => {
    setSavedPalettes([]);
    localStorage.removeItem(STORAGE_KEY);
  };
  
  return { savedPalettes, savePalette, clearHistory };
};