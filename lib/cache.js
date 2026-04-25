import { LRUCache } from 'lru-cache';

// Configuration du cache pour les résultats d'API
const options = {
  max: 500, // Stocker jusqu'à 500 entrées différentes
  ttl: 1000 * 60 * 5, // Durée de vie : 5 minutes
  updateAgeOnGet: true,
};

const cache = new LRUCache(options);

export const getCachedData = (key) => {
  return cache.get(key);
};

export const setCachedData = (key, data) => {
  cache.set(key, data);
};

export const clearCache = (key) => {
  if (key) cache.delete(key);
  else cache.clear();
};
