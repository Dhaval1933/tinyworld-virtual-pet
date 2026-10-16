import { createContext, useContext, useState, useCallback } from 'react';
import { petService, shopService, progressService } from '../services';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [pet, setPet] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPet = useCallback(async () => {
    try {
      const data = await petService.getPet();
      setPet(data.pet);
      return data.pet;
    } catch (err) {
      console.error('Failed to fetch pet:', err.message);
      return null;
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      const data = await shopService.getInventory();
      setInventory(data.inventory);
      return data.inventory;
    } catch (err) {
      console.error('Failed to fetch inventory:', err.message);
      return [];
    }
  }, []);

  const fetchProgress = useCallback(async () => {
    try {
      const data = await progressService.getProgress();
      setProgress(data.progress);
      return data.progress;
    } catch (err) {
      console.error('Failed to fetch progress:', err.message);
      return null;
    }
  }, []);

  const refreshGameData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPet(), fetchInventory(), fetchProgress()]);
    setLoading(false);
  }, [fetchPet, fetchInventory, fetchProgress]);

  const value = {
    pet,
    setPet,
    inventory,
    setInventory,
    progress,
    loading,
    fetchPet,
    fetchInventory,
    fetchProgress,
    refreshGameData,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
