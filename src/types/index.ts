/** Shared, cross-feature types. Feature-specific types live in their feature folder. */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };
