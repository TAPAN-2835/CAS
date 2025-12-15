export const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
            resolve((window as any).Razorpay)
        }
        script.onerror = () => {
            resolve(null)
        }
        document.body.appendChild(script)
    })
}

export const makePayment = async (
    amount: number,
    organizerId: string,
    type: 'listing_fee' | 'ticket_purchase',
    metadata: any = {}
) => {
    const res = await loadRazorpay()

    if (!res) {
        alert('Razorpay SDK failed to load. Are you online?')
        return
    }

    // Create order on server
    const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount,
            organizerId,
            type,
            ...metadata,
        }),
    })

    const data = await response.json()

    if (data.error) {
        alert(data.error)
        return
    }

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'CAS Platform',
        description: type === 'listing_fee' ? 'Listing Fee' : 'Ticket Purchase',
        order_id: data.orderId,
        handler: async function (response: any) {
            // Handle success
            // You might want to call another API to verify payment on server
            // or just rely on webhook
            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`)
        },
        prefill: {
            name: 'User Name', // Should come from auth context
            email: 'user@example.com',
            contact: '9999999999',
        },
        theme: {
            color: '#3B82F6',
        },
    }

    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.open()
}
