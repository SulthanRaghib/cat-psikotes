import { sqliteProvider } from "./providers/sqlite";
import { supabaseProvider } from "./providers/supabase";
import { dummyProvider } from "./providers/dummy";
import { IDatabaseProvider } from "./types";

const DB_PROVIDER = process.env.DB_PROVIDER || 'sqlite';

let activeProvider: IDatabaseProvider;

switch (DB_PROVIDER.toLowerCase()) {
  case 'supabase':
    activeProvider = supabaseProvider;
    break;
  case 'sqlite':
    activeProvider = sqliteProvider;
    break;
  case 'dummy':
  default:
    activeProvider = dummyProvider;
    break;
}

// Fallback to dummy if chosen provider is not ready
if (!activeProvider.isReady) {
  console.warn(`Database provider '${DB_PROVIDER}' is not ready. Falling back to 'dummy' provider.`);
  activeProvider = dummyProvider;
}

export default activeProvider;
