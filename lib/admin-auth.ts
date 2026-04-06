const ADMIN_EMAIL_ENV_FALLBACKS = [
  "ADMIN_EMAIL_ALLOWLIST",
  "ADMIN_EMAIL",
] as const;

export const ADMIN_EMAIL_ALLOWLIST_ENV = ADMIN_EMAIL_ENV_FALLBACKS[0];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseAllowlist(raw: string | undefined): string[] {
  if (!raw) return [];

  return Array.from(
    new Set(
      raw
        .split(/[\s,;]+/)
        .map((value) => value.trim())
        .filter(Boolean)
        .map(normalizeEmail)
    )
  );
}

export function getAdminEmailAllowlist(): string[] {
  for (const envKey of ADMIN_EMAIL_ENV_FALLBACKS) {
    const value = process.env[envKey];
    const parsed = parseAllowlist(value);
    if (parsed.length > 0) return parsed;
  }

  return [];
}

export function hasAdminEmailAllowlist(): boolean {
  return getAdminEmailAllowlist().length > 0;
}

export function isAdminEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;

  const normalizedEmail = normalizeEmail(email);
  return getAdminEmailAllowlist().includes(normalizedEmail);
}

export function getAdminAuthErrorMessage(
  reason: "missing_allowlist" | "forbidden"
): string {
  if (reason === "missing_allowlist") {
    return `El acceso admin no esta configurado. Define ${ADMIN_EMAIL_ALLOWLIST_ENV} en el entorno.`;
  }

  return "Tu email no tiene acceso al panel editorial.";
}

export function getNormalizedAdminEmail(email: string): string {
  return normalizeEmail(email);
}
