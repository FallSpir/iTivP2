import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

const FavoritesContext = createContext(null);

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.some(m => m.id === action.payload.id)) return state;
      return [...state, action.payload];
    case 'REMOVE_FAVORITE':
      return state.filter(m => m.id !== action.payload);
    case 'CLEAR_FAVORITES':
      return [];
    default:
      return state;
  }
}

function lazyInit() {
  try {
    const saved = localStorage.getItem('mh_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, undefined, lazyInit);

  useEffect(() => {
    try { localStorage.setItem('mh_favorites', JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  const value = useMemo(() => ({
    favorites,
    dispatch,
    addFavorite:    (metric) => dispatch({ type: 'ADD_FAVORITE',    payload: metric }),
    removeFavorite: (id)     => dispatch({ type: 'REMOVE_FAVORITE', payload: id }),
    clearFavorites: ()       => dispatch({ type: 'CLEAR_FAVORITES' }),
    isFavorite:     (id)     => favorites.some(m => m.id === id),
  }), [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
