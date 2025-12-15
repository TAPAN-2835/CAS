import Link from 'next/link'
import Image from 'next/image'
import { Users, MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CommunityCardProps {
    id: string
    name: string
    description: string
    membersCount: number
    location: string
    image: string
    category: string
}

export function CommunityCard({
    id,
    name,
    description,
    membersCount,
    location,
    image,
    category,
}: CommunityCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative h-40 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{name}</h3>
                    <div className="flex items-center gap-1 text-xs text-white/90">
                        <MapPin className="h-3 w-3" />
                        {location}
                    </div>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                        {category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {membersCount} members
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {description}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Link href={`/communities/${id}`} className="w-full">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Join Community
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
