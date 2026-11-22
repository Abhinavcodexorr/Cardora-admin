"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

/**
 * Renders children on document.body so `position: fixed` overlays always cover
 * the whole window, regardless of transforms/filters on ancestor elements.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const body = useSyncExternalStore(
    subscribe,
    () => document.body,
    () => null,
  );
  return body ? createPortal(children, body) : null;
}
