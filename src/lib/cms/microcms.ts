import 'server-only';

import { createClient } from 'microcms-js-sdk';

const DEFAULT_ARTICLES_ENDPOINT = 'articles';
const DEFAULT_TAGS_ENDPOINT = 'tags';

type MicroCMSClient = ReturnType<typeof createClient>;

let client: MicroCMSClient | undefined;

export class MicroCMSConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MicroCMSConfigurationError';
  }
}

export class MicroCMSFetchError extends Error {
  constructor(
    message: string,
    options?: {
      readonly cause?: unknown;
    },
  ) {
    super(message, options);
    this.name = 'MicroCMSFetchError';
  }
}

export function getMicroCMSClient(): MicroCMSClient {
  if (client) return client;

  const serviceDomain = requireEnv('MICROCMS_SERVICE_DOMAIN');
  const apiKey = requireEnv('MICROCMS_API_KEY');

  client = createClient({
    serviceDomain,
    apiKey,
    retry: true,
  });

  return client;
}

export function getMicroCMSEndpoints() {
  return {
    articles: process.env.MICROCMS_ARTICLES?.trim() || DEFAULT_ARTICLES_ENDPOINT,
    tags: process.env.MICROCMS_TAGS?.trim() || DEFAULT_TAGS_ENDPOINT,
  } as const;
}

export function toMicroCMSFetchError(endpoint: string, action: string, cause: unknown) {
  if (cause instanceof MicroCMSConfigurationError || cause instanceof MicroCMSFetchError) {
    return cause;
  }

  return new MicroCMSFetchError(`Failed to ${action} from microCMS endpoint "${endpoint}"`, {
    cause,
  });
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new MicroCMSConfigurationError(`${name} is required for microCMS server requests`);
  }

  return value;
}
