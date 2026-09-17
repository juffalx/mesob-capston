import { useSyncExternalStore } from 'react';
import { readStorage, writeStorage, removeStorage } from './storage';

const AUTH_KEY = 'mesob_auth_user';

let state = { user: readStorage(AUTH_KEY, null) };
const listeners = new Set();

const setState = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function useAuth() {
  useSyncExternalStore(subscribe, () => state);
  const { user } = state;

  const login = (userData) => {
    setState({ user: userData });
    writeStorage(AUTH_KEY, userData);
  };

  const logout = () => {
    setState({ user: null });
    removeStorage(AUTH_KEY);
  };

  return { user, isLoggedIn: Boolean(user), login, logout };
}
