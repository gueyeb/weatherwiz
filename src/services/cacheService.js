import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Set a value in cache with TTL (in ms)
 * @param {string} key
 * @param {any} value
 * @param {number} ttl - Time to live in ms
 */
export const set = async (key, value, ttl) => {
  const now = Date.now();
  const item = {
    value,
    expiry: now + ttl,
  };
  await AsyncStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get a value from cache if not expired
 * @param {string} key
 * @returns {Promise<any|null>}
 */
export const get = async (key) => {
  const itemStr = await AsyncStorage.getItem(key);
  if (!itemStr) return null;
  try {
    const item = JSON.parse(itemStr);
    if (!item.expiry || Date.now() > item.expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    await AsyncStorage.removeItem(key);
    return null;
  }
};

/**
 * Remove a value from cache
 * @param {string} key
 */
export const remove = async (key) => {
  await AsyncStorage.removeItem(key);
};

/**
 * Clear all cache (use with caution)
 */
export const clear = async () => {
  await AsyncStorage.clear();
};
