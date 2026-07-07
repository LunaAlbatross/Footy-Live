import { getTodaysMatches } from './src/lib/api.js';
(async () => {
  try {
    const data = await getTodaysMatches();
    console.log('Matches fetched:', data?.length ?? 'none');
  } catch (e) {
    console.error('Error:', e);
  }
})();
