// src/hooks/useLocation.js
// useLocation custom hook

import { useContext } from 'react';
import { LocationContext } from '../context/LocationContext';

// This hook is a simple re-export of the LocationContext
// We already defined the logic in the context provider
export const useLocation = () => {
  return useContext(LocationContext);
};