import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status
    } = payload;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    if (!serverKey) {
      return NextResponse.json({ error: 'Server key not configured' }, { status: 500 });
    }

    // 1. Verifikasi Signature Key Midtrans untuk Keamanan
    const hash = crypto.createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (hash !== signature_key) {
      console.error('Invalid Midtrans Signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // 2. Ekstrak order_id asli (format kita: HOMY-{id}-{timestamp})
    // Menggunakan split dan slice agar ID bertipe UUID tetap aman meskipun mengandung tanda strip '-'
    const parts = order_id.split('-');
    if (parts.length < 3) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }
    const actualOrderId = parts.slice(1, -1).join('-');

    // 3. Tentukan status untuk Database
    let dbStatus = 'pending';
    
    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        dbStatus = 'paid';
      }
    } else if (transaction_status === 'settlement') {
      dbStatus = 'paid';
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire' ||
      transaction_status === 'failure'
    ) {
      dbStatus = 'failed';
    } else if (transaction_status === 'pending') {
      dbStatus = 'pending';
    }

    // 4. Update Database Supabase jika status berubah
    if (dbStatus !== 'pending') {
       const { error } = await supabase
         .from('orders')
         .update({ status: dbStatus })
         .eq('id', actualOrderId);

       if (error) {
         console.error('Webhook update order error:', error);
         return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
       }
       console.log(`Order ${actualOrderId} updated to ${dbStatus} via Midtrans Webhook`);
    }

    return NextResponse.json({ status: 'ok', message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
