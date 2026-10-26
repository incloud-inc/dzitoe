async function main() {
  console.log('Fetching from http://localhost:3000...');
  
  const eps = [
    '/api/kurikulum',
    '/api/kurikulum/bab',
    '/api/kurikulum/materi',
    '/api/kurikulum/mapel'
  ];

  for (const ep of eps) {
    try {
      const res = await fetch('http://localhost:3000' + ep);
      const json = await res.json();
      console.log(`[${ep}] OK, returned ${json.data?.length ?? 0} items`);
      if (json.data?.length > 0) {
        console.log(`  Sample:`, Object.keys(json.data[0]));
      }
    } catch (e) {
      console.error(`[${ep}] Failed:`, e.message);
    }
  }
}
main().catch(console.error);
