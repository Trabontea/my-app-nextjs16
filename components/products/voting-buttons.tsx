'use client';
import {
  downvoteProductAction,
  upvoteProductAction,
} from '@/lib/products/product-actions';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/button';

export default function VotingButtons({
  hasVoted,
  voteCount: initialVoteCount,
  productId,
}: {
  hasVoted?: boolean;
  voteCount: number;
  productId: number;
}) {
  // useOptimistic hook manages optimistic UI updates for the vote count
  // It takes the initial vote count and a reducer function that:
  // - Receives the current count and a change value (+1 or -1)
  // - Returns the new count, ensuring it never goes below 0 with Math.max
  // This allows the UI to update immediately before the server action completes
  const [optimisticVoteCount, setOptimisticVoteCount] = useOptimistic(
    initialVoteCount,
    (currentCount, change: number) => Math.max(0, currentCount + change),
  );

  // useTransition hook provides isPending state and startTransition function
  // isPending indicates if a transition is in progress (used to disable buttons)
  // startTransition marks updates as non-urgent, allowing React to keep the UI responsive
  const [isPending, startTransition] = useTransition();

  // Handle upvote action
  const handleUpvote = async () => {
    // Wrap the update in startTransition to make it non-blocking
    startTransition(async () => {
      // Optimistically increment the vote count by 1 (updates UI immediately)
      setOptimisticVoteCount(1);
      // Execute the server action to persist the upvote to the database
      await upvoteProductAction(productId);
    });
  };

  // Handle downvote action (remove a vote)
  const handleDownvote = async () => {
    // Wrap the update in startTransition to make it non-blocking
    startTransition(async () => {
      // Optimistically decrement the vote count by 1 (updates UI immediately)
      setOptimisticVoteCount(-1);
      // Execute the server action to persist the downvote to the database
      await downvoteProductAction(productId);
    });
  };

  return (
    <div
      className="flex flex-col items-center gap-1 shrink-0"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        onClick={handleUpvote}
        variant="ghost"
        size="icon-sm"
        className={cn(
          'h-8 w-8 text-primary ',
          hasVoted
            ? 'bg-primary/10 text-primary hover:bg-primary/20'
            : 'hover:bg-primary/10 hover:text-primary',
        )}
        disabled={isPending}
      >
        <ChevronUpIcon className="size-5" />
      </Button>
      <span className="text-sm font-semibold transition-colors text-foreground">
        {optimisticVoteCount}
      </span>
      <Button
        onClick={handleDownvote}
        variant="ghost"
        size="icon-sm"
        disabled={isPending}
        className={cn(
          'h-8 w-8 text-primary ',
          hasVoted ? 'hover:text-destructive' : 'opacity-50 cursor-not-allowed',
        )}
      >
        <ChevronDownIcon className="size-5" />
      </Button>
    </div>
  );
}
