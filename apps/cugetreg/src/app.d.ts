declare namespace App {
  interface Locals {
    user: { id: string; email: string; name: string } | null;
    session: { id: string; expiresAt: Date } | null;
  }
}
