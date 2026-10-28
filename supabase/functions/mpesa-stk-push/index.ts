import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, amount, reference = 'DONATION' } = await req.json()

    // Ensure amount is an integer, Payero might reject decimals or strings
    const parsedAmount = parseInt(amount, 10);

    // Clean phone number (convert 07xx to 2547xx)
    let cleanPhone = String(phone).replace(/\s+/g, '')
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.substring(1)
    } else if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1)
    }

    // Fetch Payero API Credentials securely from Supabase Environment Variables
    const PAYERO_AUTH = Deno.env.get('PAYERO_AUTH') || "Basic ZWZBRTduNk1MOFJ4NUkweTFlQlQ6SnNTWmVrbzBWNFJsNVBXclhHNU5EUDlha0phZEFGUUdRMzFzMk0xMA==";
    const ACCOUNT_ID = Deno.env.get('PAYERO_ACCOUNT_ID') || "12947";

    // Initiate Payero STK Push
    const payeroRes = await fetch("https://app.payero.co.ke/api/v1/payments/mpesa/stk", {
      method: "POST",
      headers: {
        "Authorization": PAYERO_AUTH,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        account_id: ACCOUNT_ID,
        amount: amount,
        phone: cleanPhone,
        reference: reference
      })
    })

    const responseText = await payeroRes.text(); // Parse as text first in case it's not JSON

    // Try to parse JSON safely
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { raw_response: responseText };
    }

    // Always return 200 to the frontend so we can read the Payero error in the browser console
    return new Response(JSON.stringify({
      payero_status: payeroRes.status,
      payero_response: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
