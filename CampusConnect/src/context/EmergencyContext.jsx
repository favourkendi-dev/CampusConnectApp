import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, collection, query, where, orderBy, onSnapshot } from '../firebase/config';

const EmergencyContext = createContext(null);

export const EmergencyProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'emergencyAlerts'),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setAlerts(alertData);
      setActiveAlert(alertData[0] || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const dismissAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    if (activeAlert?.id === alertId) {
      setActiveAlert(alerts[1] || null);
    }
  }, [activeAlert, alerts]);

  return (
    <EmergencyContext.Provider value={{ alerts, activeAlert, loading, dismissAlert }}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within EmergencyProvider');
  return context;
};