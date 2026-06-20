import { IDatabaseProvider } from './types';
import { sqliteProvider } from './providers/sqlite';
import { supabaseProvider } from './providers/supabase';
import { dummyProvider } from './providers/dummy';

function initializeProvider(): IDatabaseProvider {
  const envProvider = process.env.DB_PROVIDER || 'sqlite';
  
  console.log(`[DB] Attempting to initialize provider: ${envProvider}`);

  let provider: IDatabaseProvider | null = null;

  if (envProvider === 'supabase') {
    provider = supabaseProvider;
  } else if (envProvider === 'sqlite') {
    provider = sqliteProvider;
  } else if (envProvider === 'dummy') {
    provider = dummyProvider;
  }

  // Check if chosen provider is ready (e.g. connected properly)
  if (provider && provider.isReady) {
    console.log(`[DB] Successfully connected to ${provider.name}`);
    return provider;
  }

  // Fallback Logic
  console.warn(`[DB] Provider '${envProvider}' is not ready or failed to initialize.`);
  console.warn(`[DB] FALLBACK: Switching to Dummy Provider to prevent system crash.`);
  
  return dummyProvider;
}

const DB = initializeProvider();

export default DB;
