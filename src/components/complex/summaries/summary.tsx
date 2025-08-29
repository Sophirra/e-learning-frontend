import { Button, type buttonVariants } from "@/components/ui/button.tsx";
import type { VariantProps } from "class-variance-authority";
import React, { useState } from "react";
import { Divider } from "@/components/ui/divider.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

type ButtonComponentProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

interface SummaryProps {
  label: string;
  labelIcon: React.ComponentType<any>;
  canHide?: boolean;
  onAddButtonClick?: () => void;
  customButton?: React.ComponentType<ButtonComponentProps>;
  children?: React.ReactNode;
}

export default function Summary({
  label,
  labelIcon: LabelIcon,
  canHide,
  onAddButtonClick,
  customButton: CustomButton,
  children,
}: SummaryProps) {
  let [open, setOpen] = useState<boolean>(true);
  return (
    <div className={"flex flex-col gap-1"}>
      <div className="flex items-center justify-between gap-2">
        <Button
          variant={"ghost"}
          onClick={canHide ? () => setOpen(!open) : () => {}}
          className={"w-1/1"}
        >
          <LabelIcon />
          {label}
          <div className="flex-grow w-1/1" />
          {canHide && (open ? <icons.ChevronUp /> : <icons.ChevronDown />)}
        </Button>
        {onAddButtonClick && (
          <Button onClick={onAddButtonClick} variant="ghost">
            <icons.Plus /> Add
          </Button>
        )}
        {CustomButton && <CustomButton />}
      </div>
      <Divider />
      {open && <div className={"flex flex-col gap-2"}>{children}</div>}
    </div>
  );
}
