import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { worldService } from '../services';

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [world, setWorld] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const saveTimeoutRef = useRef(null);

  const fetchWorld = useCallback(async () => {
    try {
      setLoading(true);
      const data = await worldService.getWorld();
      setWorld(data.world);
      return data.world;
    } catch (err) {
      console.error('Failed to fetch world:', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update room layout locally and debounce save to server.
   */
  const updateLayout = useCallback((newLayout) => {
    setWorld((prev) => prev ? { ...prev, roomLayout: newLayout } : prev);

    // Debounce save (1 second)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await worldService.updateLayout(newLayout);
      } catch (err) {
        console.error('Failed to save layout:', err.message);
      }
    }, 1000);
  }, []);

  const saveLayoutNow = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (world?.roomLayout) {
      try {
        await worldService.updateLayout(world.roomLayout);
      } catch (err) {
        console.error('Failed to save layout:', err.message);
      }
    }
  }, [world]);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => {
      if (prev) {
        // Leaving edit mode — force save
        saveLayoutNow();
        setSelectedItem(null);
      }
      return !prev;
    });
  }, [saveLayoutNow]);

  const value = {
    world,
    setWorld,
    editMode,
    toggleEditMode,
    selectedItem,
    setSelectedItem,
    loading,
    fetchWorld,
    updateLayout,
    saveLayoutNow,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}

export default RoomContext;
