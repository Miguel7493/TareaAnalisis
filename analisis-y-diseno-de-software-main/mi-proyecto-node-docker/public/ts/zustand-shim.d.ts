declare module "zustand" {
  export type StateCreator<T> = (
    set: (updater: (state: T) => T | Partial<T>) => void,
    get: () => T,
  ) => T;

  export interface UseStore<T> {
    (): T;
    <U>(selector: (state: T) => U): U;
  }

  export default function create<T>(creator: StateCreator<T>): UseStore<T>;
}
