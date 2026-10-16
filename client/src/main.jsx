import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { RoomProvider } from './context/RoomContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <RoomProvider>
            <App />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#FFFFFF',
                  color: '#343447',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(52, 52, 71, 0.08)',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '14px',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: { primary: '#7DD4A0', secondary: '#FFFFFF' },
                },
                error: {
                  iconTheme: { primary: '#FF8A8A', secondary: '#FFFFFF' },
                },
              }}
            />
          </RoomProvider>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
