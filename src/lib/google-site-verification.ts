const FILE_PATTERN = /^google[a-z0-9]+\.html$/i;

export function googleSiteVerificationBody(file: string): string | null {
  if (!FILE_PATTERN.test(file)) {
    return null;
  }

  return `google-site-verification: ${file}\n`;
}
