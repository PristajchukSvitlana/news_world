import { useEffect, useRef, useState } from "react";

export default function useQueryParamsState<T extends Record<string, any>>(defaults: T) {
  const first = useRef(true);

  const [state, setState] = useState<T>(() => {
    const url = new URL(window.location.href);
    const obj: T = { ...defaults };

    for (const k of Object.keys(defaults) as (keyof T)[]) {
      const v = url.searchParams.get(k);
      if (v != null) {
        obj[k] = (typeof defaults[k] === "number" ? Number(v) : v) as T[typeof k];
      }
    }
    return obj;
  });

  useEffect(() => {
    if (!first.current) {
      const url = new URL(window.location.href);
      Object.entries(state).forEach(([k, v]) => {
        if (v == null || v === "") url.searchParams.delete(k);
        else url.searchParams.set(k, String(v));
      });
      window.history.replaceState({}, "", url.toString());
    } else {
      first.current = false;
    }
  }, [state]);

  return [state, setState] as const;
}
