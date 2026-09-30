const SENSITIVE_QUERY_KEYS = new Set([
  'token',
  'access_token',
  'accesstoken',
  'refresh_token',
  'refreshtoken',
  'secret',
  'signature',
  'api_key',
  'apikey',
  'password',
]);

export function sanitizeUrl(url: string): string {
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) return url;

  const path = url.slice(0, queryIndex);
  const queryString = url.slice(queryIndex + 1);
  const sanitized = queryString
    .split('&')
    .map((part) => {
      const equalsIndex = part.indexOf('=');
      if (equalsIndex === -1) return part;

      const key = part.slice(0, equalsIndex);
      if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) {
        return `${key}=[REDACTED]`;
      }
      return part;
    })
    .join('&');

  return `${path}?${sanitized}`;
}

export const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  'req.body.password',
  'req.body.newPassword',
  'req.body.currentPassword',
  'req.body.token',
  'req.body.refresh_token',
  'req.body.access_token',
  '*.password',
  '*.newPassword',
  '*.currentPassword',
  '*.token',
  '*.refresh_token',
  '*.access_token',
  'err.parameters',
  'err.driverError.parameters',
  '*.parameters',
];
