/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
    db: any; // O el tipo de DrizzleD1Database
    lucia: import("lucia").Lucia;
    runtime: import("@astrojs/cloudflare").Runtime<Env>;
  }
}

interface Env {
  DB: D1Database;
}
