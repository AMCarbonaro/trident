import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;

// Force Node.js runtime (not Edge) to support postgres package
export const runtime = 'nodejs';

