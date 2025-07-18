/**
 * A set of scroll area components built on top of Radix UI ScrollArea primitives.
 * Provides a customizable and cross-browser consistent scrolling experience.
 * @module
 */
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

/**
 * A scrollable container component that provides custom styled scrollbars.
 * Wraps content in a viewport with consistent scrolling behavior across browsers.
 *
 * @component
 * @param {string} className - Additional CSS classes for styling the container
 * @param {React.ReactNode} children - Content to be rendered inside the scroll area
 * @param {React.ComponentProps<typeof ScrollAreaPrimitive.Root>} props - Additional props for the root element
 */
function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-neutral-950/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 dark:focus-visible:ring-neutral-300/50"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

/**
 * A customizable scrollbar component that can be oriented vertically or horizontally.
 * Provides a styled thumb element that indicates the current scroll position.
 *
 * @component
 * @param {string} className - Additional CSS classes for styling the scrollbar
 * @param {"vertical" | "horizontal"} orientation - The scrollbar orientation
 * @param {React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>} props - Additional props for the scrollbar element
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-neutral-200 relative flex-1 rounded-full dark:bg-neutral-800"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
