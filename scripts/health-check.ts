import 'dotenv/config';
import { healthCheck } from '../db/index';

(async () => {
  try {
    const ok = await healthCheck();
    console.log(`Database up: ${ok}`);
    process.exit(ok ? 0 : 1);
  } catch (err) {
    console.error('Health check failed:', err);
    process.exit(1);
  }
})();
