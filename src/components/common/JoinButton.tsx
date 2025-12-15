"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JoinSuccessModal } from "./JoinSuccessModal";
import { cn } from "@/lib/utils";
import { joinEvent } from "@/app/actions/events";
import { analytics } from "@/lib/analytics";
import { Loader2 } from "lucide-react";

interface JoinButtonProps {
    event: any;
    className?: string;
    userId?: string;
}

export function JoinButton({ event, className, userId = "user-123-mock" }: JoinButtonProps) {
    const [isJoined, setIsJoined] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toast = (msg: string) => {
        // Basic alert for error since we don't have toast installed yet in this snippet context
        alert(msg);
    };

    const handleJoin = async () => {
        analytics.track("join_initiated", { eventId: event.id, title: event.title });
        setIsLoading(true);

        try {
            // If we are already attending (client-side check), we can skip or just show modal
            // But here we call server
            const result = await joinEvent(event.id, userId);

            if (result.success) {
                setIsJoined(true);
                setShowModal(true);
                analytics.track("join_completed", { eventId: event.id });
            } else {
                // Handle specific case where user is already joined
                if (result.message === "Already joined") {
                    setIsJoined(true);
                    // Don't show modal maybe? Or show "You're already in" toast
                    toast("You have already joined this event!");
                } else {
                    analytics.track("join_failed", { eventId: event.id, reason: result.message });
                    toast(result.message);
                }
            }
        } catch (e) {
            console.error(e);
            toast("Failed to join event");
        } finally {
            setIsLoading(false);
        }
    };

    if (isJoined) {
        return (
            <>
                <Button
                    size="lg"
                    variant="secondary"
                    className={cn("w-full bg-green-100 text-green-800 hover:bg-green-200 cursor-default", className)}
                >
                    You are attending
                </Button>
                <JoinSuccessModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    event={event}
                />
            </>
        );
    }

    return (
        <>
            <Button
                size="lg"
                className={cn("w-full mb-4 text-lg shadow-lg shadow-primary/20", className)}
                onClick={handleJoin}
                disabled={isLoading}
            >
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...</> : "Get Tickets"}
            </Button>
            <JoinSuccessModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                event={event}
            />
        </>
    );
}
