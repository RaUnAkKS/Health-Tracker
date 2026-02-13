import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useUserStore from './store/userStore';
import useSettingsStore from './store/settingsStore';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Insight from './pages/Insight';
import History from './pages/History';
import Profile from './pages/Profile';
import SugarIntelligence from './pages/SugarIntelligence';
import Calendar from './pages/Calendar';

import FeatureLocked from './components/FeatureLocked';

function App() {
    const { isOnboarded, isAnonymous, initializeFromStorage } = useUserStore();
    const { initializeDarkMode } = useSettingsStore();

    useEffect(() => {
        // Initialize from storage on app load
        initializeFromStorage();
        initializeDarkMode();
    }, []);

    return (
        <BrowserRouter>
            <AnimatePresence mode="wait">
                <Routes>
                    {/* Onboarding Route */}
                    <Route
                        path="/"
                        element={
                            isOnboarded ? <Navigate to="/dashboard" replace /> : <Onboarding />
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            isOnboarded ? <Dashboard /> : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/insight"
                        element={
                            isOnboarded ? <Insight /> : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            isOnboarded ? <History /> : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/calendar"
                        element={
                            isOnboarded ? (
                                !isAnonymous ? <Calendar /> : <FeatureLocked />
                            ) : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            isOnboarded ? <Profile /> : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/intelligence"
                        element={
                            isOnboarded ? (
                                !isAnonymous ? <SugarIntelligence /> : <FeatureLocked />
                            ) : <Navigate to="/" replace />
                        }
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AnimatePresence>
        </BrowserRouter>
    );
}

export default App;
