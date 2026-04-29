const REQUIRED_ENV_VARS = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
};

export function validateEnv(): void {
  const missing = Object.entries(REQUIRED_ENV_VARS)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(`[ENV WARNING] Missing env vars: ${missing.join(", ")}`);
  }
}
