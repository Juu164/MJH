import localforage from 'localforage';

localforage.config({
  name: 'calzik-app',
});

export function getItem<T>(key: string): Promise<T | null> {
  return localforage.getItem<T>(key);
}

export function setItem<T>(key: string, value: T): Promise<T> {
  return localforage.setItem(key, value);
}
