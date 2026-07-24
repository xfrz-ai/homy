import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, gross_amount, customer_name, customer_email, items } = body;

    if (!order_id || !gross_amount) {
      return NextResponse.json(
        { error: 'order_id and gross_amount are required' },
        { status: 400 }
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json(
        { error: 'Midtrans server key not configured' },
        { status: 500 }
      );
    }

    // Build Midtrans Snap transaction payload
    const transactionPayload = {
      transaction_details: {
        order_id: `HOMY-${order_id}-${Date.now()}`,
        gross_amount: gross_amount,
      },
      customer_details: {
        first_name: customer_name || 'Customer',
        email: customer_email || 'customer@example.com',
      },
      item_details: items?.map((item: { name: string; price: number; qty: number }) => ({
        id: item.name?.substring(0, 50) || 'item',
        price: item.price,
        quantity: item.qty,
        name: item.name?.substring(0, 50) || 'Product',
      })) || [
        {
          id: `order-${order_id}`,
          price: gross_amount,
          quantity: 1,
          name: 'Order Payment',
        },
      ],
    };

    // Call Midtrans Snap API (Sandbox)
    const authString = Buffer.from(`${serverKey}:`).toString('base64');

    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Midtrans API error:', data);
      return NextResponse.json(
        { error: data.error_messages?.join(', ') || 'Failed to create transaction' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      snap_token: data.token,
      redirect_url: data.redirect_url,
    });
  } catch (error) {
    console.error('Midtrans route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
