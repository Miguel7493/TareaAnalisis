declare module "react" {
  export type ReactNode = any;

  export interface FormEvent<T = EventTarget> {
    readonly currentTarget: T;
    preventDefault(): void;
  }

  export interface ChangeEvent<T = EventTarget> {
    readonly currentTarget: T;
    readonly target: T;
  }

  export interface RefObject<T> {
    readonly current: T | null;
  }

  export function useState<T>(initial: T | (() => T)): [
    T,
    (value: T | ((prev: T) => T)) => void,
  ];
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useRef<T>(initial: T | null): RefObject<T>;
  export function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: readonly unknown[],
  ): T;
}

declare module "react-dom/client" {
  interface Root {
    render(children: any): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  type Element = any;
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
