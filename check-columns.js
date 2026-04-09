import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tfkeuiktciczxurlvuct.supabase.co";
const SUPABASE_KEY = "sb_publishable_roHnvrQf_0JDkJgEoa5ryg_9mpBZlWR";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkColumns() {
  console.log('Checking available columns...\n');

  const columnCombos = [
    ['id'],
    ['id', 'wallet'],
    ['id', 'wallet', 'seedphrase'],
    ['id', 'wallet', 'seedPhrase'],
    ['id', 'wallet', 'seed_phrase'],
    ['id', 'wallet', 'seedphrase', 'timestamp'],
    ['id', 'wallet', 'timestamp'],
  ];

  for (const cols of columnCombos) {
    try {
      const query = supabase.from('submissions').select(cols.join(','));
      const { data, error } = await query.limit(1);
      
      if (!error) {
        console.log('✅ SUCCESS with columns:', cols);
        if (data && data.length > 0) {
          console.log('Sample data:', JSON.stringify(data[0], null, 2));
        }
        return cols;  // Return the working columns
      } else {
        console.log('❌', cols.join(', '), '→', error.message);
      }
    } catch (e) {
      console.log('❌', cols.join(', '), '→ Exception');
    }
  }
}

checkColumns().catch(console.error);
