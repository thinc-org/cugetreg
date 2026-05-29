import { useContextStore } from './stores';

const CART_KEY = Symbol('user');

export interface UserInterface {
  name: string;
  id: string;
  current_ay: string;
  semester: string;
}

export const { initStore: initUserStore, getStore: getUserStore } =
  useContextStore(CART_KEY);
