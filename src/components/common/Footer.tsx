import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">CAS Platform</h3>
                        <p className="text-sm text-muted-foreground">
                            Discover local communities, events, and meetups. Join the movement today.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/search" className="hover:text-foreground">Browse Events</Link></li>
                            <li><Link href="/search" className="hover:text-foreground">Browse Communities</Link></li>
                            <li><Link href="/organizer/dashboard" className="hover:text-foreground">For Organizers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                            <li><a href="#" className="hover:text-foreground">Instagram</a></li>
                            <li><a href="#" className="hover:text-foreground">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} CAS Platform. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
