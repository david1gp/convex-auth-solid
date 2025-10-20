export function isDevEnvVite() {
  return import.meta.env.MODE === "development"
}
