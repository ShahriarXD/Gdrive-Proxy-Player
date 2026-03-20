const AUTH_ENV_NAMES = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

export function getEnv(name: string) {
  return process.env[name];
}

export function hasAuthEnv() {
  return AUTH_ENV_NAMES.every((name) => Boolean(process.env[name]));
}
