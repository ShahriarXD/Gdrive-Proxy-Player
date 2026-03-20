const REQUIRED_AUTH_ENV_NAMES = [
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

const OPTIONAL_AUTH_ENV_NAMES = [
  "NEXTAUTH_URL",
] as const;

export function getEnv(name: string) {
  return process.env[name];
}

export function hasAuthEnv() {
  return REQUIRED_AUTH_ENV_NAMES.every((name) => Boolean(process.env[name]));
}

export function getMissingAuthEnv() {
  return REQUIRED_AUTH_ENV_NAMES.filter((name) => !process.env[name]);
}

export function getMissingOptionalAuthEnv() {
  return OPTIONAL_AUTH_ENV_NAMES.filter((name) => !process.env[name]);
}
