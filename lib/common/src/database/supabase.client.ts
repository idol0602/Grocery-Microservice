import { createClient, SupabaseClient } from '@supabase/supabase-js';

const clientCache = new Map<string, SupabaseClient>();

export function getSupabaseClient(url: string, serviceRoleKey: string) {
  const cacheKey = `${url}:${serviceRoleKey.slice(0, 8)}`;

  if (!clientCache.has(cacheKey)) {
    clientCache.set(
      cacheKey,
      createClient(url, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }),
    );
  }

  return clientCache.get(cacheKey)!;
}
