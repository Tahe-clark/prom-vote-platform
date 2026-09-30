export type AdminActionResult =
  | { ok: true }
  | { ok: false; error: "locked" | "invalid" | "failed" };
