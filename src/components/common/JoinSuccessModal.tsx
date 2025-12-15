"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { AddToCalendar } from "@/components/common/AddToCalendar";
import Link from "next/link";

interface JoinSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        title: string;
        date: Date | string;
        location: string;
        description?: string;
        id: string;
    };
}

export function JoinSuccessModal({ isOpen, onClose, event }: JoinSuccessModalProps) {
    // Ensure date is a Date object for AddToCalendar
    const dateObj = new Date(event.date);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center text-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-xl">You're in!</DialogTitle>
                    <DialogDescription>
                        You have successfully joined <strong>{event.title}</strong>.
                        A confirmation email has been sent to you.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <AddToCalendar
                        title={event.title}
                        description={event.description}
                        location={event.location}
                        startDate={dateObj}
                        className="w-full"
                    />
                    {/* Can add more specific info here if needed */}
                </div>

                <DialogFooter className="sm:justify-center gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/tickets">View Ticket</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
