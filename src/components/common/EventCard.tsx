import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface EventCardProps {
    id: string
    title: string
    date: string
    time: string
    location: string
    price: number
    image: string
    category: string
    organizerName: string
}

export function EventCard({
    id,
    title,
    date,
    time,
    location,
    price,
    image,
    category,
    organizerName,
}: EventCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-4 right-4 bg-white/90 text-black hover:bg-white/100">
                    {category}
                </Badge>
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="text-sm text-muted-foreground mb-1">{organizerName}</div>
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {title}
                </h3>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{new Date(date).toLocaleDateString()} • {time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="line-clamp-1">{location}</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between mt-2">
                <div className="font-bold text-lg">
                    {price === 0 ? 'Free' : `$${price}`}
                </div>
                <Link href={`/events/${id}`}>
                    <Button size="sm">View Details</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
