import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const useActivityTracker = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!user) return;

    let inactivityTimer;
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      setIsActive(true);
      
      // Notify server about activity
      if (user.isActive) {
        inactivityTimer = setTimeout(() => {
          setIsActive(false);
          // You can notify backend about inactivity here
          console.log('User inactive - screen not working');
        }, 5 * 60 * 1000); // 5 minutes inactivity
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start the timer

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  return { isActive };
};

export default useActivityTracker;