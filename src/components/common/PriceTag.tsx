import { cn } from "@/lib/utils";

interface PriceTagProps {
    price: number;
    currency?: string;
    className?: string;
    freeLabel?: string;
}

export function PriceTag({ price, currency = "INR", className, freeLabel = "Free" }: PriceTagProps) {
    const isFree = price === 0;

    return (
        <span className={cn("font-semibold text-primary", className)}>
            {isFree ? (
                <span className="text-green-600">{freeLabel}</span>
            ) : (
                <span>
                    {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: currency,
                        maximumFractionDigits: 0,
                    }).format(price)}
                </span>
            )}
        </span>
    );
}
