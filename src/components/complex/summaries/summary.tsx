import { Button } from "@/components/ui/button.tsx";
import React, { useState } from "react";
import { Divider } from "@/components/ui/divider.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

interface SummaryProps {
  label: string;
  labelIcon: React.ComponentType<any>;
  canHide?: boolean;
  onAddButtonClick?: () => void;
  customButton?: React.ComponentType<Record<string, unknown>> | undefined;
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
          className={"grow"}
        >
          <LabelIcon />
          {label}
          <div className="flex-grow" />
          {canHide && (open ? <icons.ChevronUp /> : <icons.ChevronDown />)}
        </Button>
        {CustomButton && <CustomButton onClick={onAddButtonClick} />}
        {onAddButtonClick && (
          <Button onClick={onAddButtonClick} variant="ghost">
            <icons.Plus /> Add
          </Button>
        )}
      </div>
      <Divider />
      {open && <div className={"flex flex-col gap-2"}>{children}</div>}
    </div>
  );
}
