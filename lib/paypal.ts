const base = process.env.PAYPAL_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
  createOrder: async (price: number) => {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: price,
              },
            },
          ],
        }),
      });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  captureOrder: async (orderId: string) => {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders/${orderId}/capture`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

async function generateAccessToken() {
  try {
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    return data.access_token;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
