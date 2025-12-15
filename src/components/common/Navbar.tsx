import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            CAS
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/search" className="hover:text-foreground transition-colors">
                            Explore
                        </Link>
                        <Link href="/search?type=events" className="hover:text-foreground transition-colors">
                            Events
                        </Link>
                        <Link href="/search?type=communities" className="hover:text-foreground transition-colors">
                            Communities
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search events & communities..."
                            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm">Sign up</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
