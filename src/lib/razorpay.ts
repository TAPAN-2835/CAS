import { DUMMY_PAYMENT_MODE } from "./constants"

export const loadRazorpay = () => {
    // Return mock if dummy mode is on to avoid loading script unnecessarily
    if (DUMMY_PAYMENT_MODE) return Promise.resolve(true);

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
    // 1. DUMMY MODE CHECK
    if (DUMMY_PAYMENT_MODE) {
        // Load nothing, just proceed to call API which handles logic
    } else {
        const res = await loadRazorpay()
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }
    }

    // Create order on server (or dummy record)
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

    // 2. HANDLE DUMMY SUCCESS
    if (DUMMY_PAYMENT_MODE && data.dummySuccess) {
        alert('Payment Successful (Test Mode)')
        // Reload or redirect could present here, but typically we let the UI component handle state update
        // Since this function returns void, the calling component usually waits or doesn't know.
        // The original code uses `handler` callback inside Razorpay options. 
        // We can't easily trigger that callback unless we change the signature of makePayment or return a promise.
        // Current signature returns `Promise<void>`.
        // To be effective, we should probably allow the caller to know it succeeded.
        // However, looking at usage in `PaymentService`... it just calls `makePayment`.
        // We might need to reload window to show updated state if the caller doesn't await a result properly.
        window.location.reload();
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
            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`)
            window.location.reload();
        },
        prefill: {
            name: 'User Name',
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
