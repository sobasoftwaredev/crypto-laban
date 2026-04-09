import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tfkeuiktciczxurlvuct.supabase.co";
const SUPABASE_KEY = "sb_publishable_roHnvrQf_0JDkJgEoa5ryg_9mpBZlWR";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function diagnose() {
  console.log('🔍 DIAGNOSTIC TEST\n');

  // Step 1: Check if we can connect
  console.log('1. Testing table access...');
  const { data: checkData, error: checkError } = await supabase
    .from('submissions')
    .select('*')
    .limit(1);

  if (checkError) {
    console.error('❌ Cannot access table:', checkError.message);
    return;
  }
  console.log('✅ Table accessible');
  console.log('Current rows in table:', checkData?.length || 0);

  // Step 2: Try to insert with snake_case
  console.log('\n2. Testing insert with snake_case (seed_phrase)...');
  const { data: insertData, error: insertError } = await supabase
    .from('submissions')
    .insert([{
      wallet: 'TestWallet',
      seed_phrase: 'test word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
      timestamp: Date.now()
    }]);

  if (insertError) {
    console.error('❌ Insert failed:', insertError);
    console.error('Message:', insertError.message);
  } else {
    console.log('✅ Insert successful');
  }

  // Step 3: Fetch all rows
  console.log('\n3. Fetching all submissions...');
  const { data: allData, error: fetchError } = await supabase
    .from('submissions')
    .select('*')
    .order('timestamp', { ascending: false });

  if (fetchError) {
    console.error('❌ Fetch failed:', fetchError);
  } else {
    console.log('✅ Total submissions:', allData?.length || 0);
    if (allData && allData.length > 0) {
      console.log('\n📋 First submission:');
      console.log(JSON.stringify(allData[0], null, 2));
    }
  }
}

diagnose().catch(console.error);
