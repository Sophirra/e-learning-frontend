import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A card component that serves as a container for content with a consistent style.
 * @param {string} className - Additional CSS classes to apply to the card
 * @param {React.ComponentProps<"div">} props - Additional props to pass to the div element
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-white text-neutral-950 flex flex-col gap-6 rounded-xl border border-neutral-200 py-6 shadow-sm dark:bg-neutral-950 dark:text-neutral-50 dark:border-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The header section of a card component.
 * @param {string} className - Additional CSS classes to apply to the header
 * @param {React.ComponentProps<"div">} props - Additional props to pass to the div element
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The title component for a card header.
 * @param {string} className - Additional CSS classes to apply to the title
 * @param {React.ComponentProps<"div">} props - Additional props to pass to the div element
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

/**
 * A description component for additional content in a card header.
 * @param {string} className - Additional CSS classes to apply to the description
 * @param {React.ComponentProps<"div">} props - Additional props to pass to the div element
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-neutral-500 text-sm dark:text-neutral-400",
        className,
      )}
      {...props}
    />
  );
}

/**
 * An action component that appears in the top-right of a card header.
 * @param {string} className - Additional CSS classes to apply to the action
 * @param {React.ComponentProps<"div">} props - Additional props to pass to the div element
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The main content area of a card component.
 * @param {string} className - Additional CSS classes to apply to the content
 * @param {React.ComponentProps<"div">} props - Additional props to pass to the div element
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

/**
 * The footer section of a card component.
 * @param {string} className - Additional CSS classes to apply to the footer
 * @param {React.ComponentProps<"div">} props - Additional props to pass to the div element
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
