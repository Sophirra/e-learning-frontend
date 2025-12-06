import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { MenubarItem } from "@/components/ui/menubar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import {
  addAvailability,
  getTeacherAvailability,
  getTeacherUpcomingClasses,
} from "@/api/apiCalls.ts";
import { useEffect, useState } from "react";
import type { ApiDayAvailability, ClassSchedule } from "@/api/types.ts";
import Schedule from "@/components/complex/schedules/schedule.tsx";

type selectedSlots = {
  date: Date;
  slots: number[];
};

export function AddAvailabilityPopup() {
  const [slots, setSlots] = useState<selectedSlots[]>([]);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [existingAvailability, setExistingAvailability] = useState<
    ApiDayAvailability[]
  >([]);

  function setupAvailability() {
    try {
      const mappedSlots = slots.map((slot): ApiDayAvailability => {
        // const timeslots = slot.slots.map((slot) => {})
        const sorted = slot.slots.sort();
        const timeslots = sorted.reduce(
          (acc, slot) => {
            const prev = acc[acc.length - 1];

            if (!prev) {
              acc.push({ from: slot, to: slot + 1 });
            }
            if (slot === prev.to) {
              prev.to = slot + 1;
            } else {
              acc.push({ from: slot, to: slot + 1 });
            }
            return acc;
          },
          [] as { from: number; to: number }[],
        );
        return {
          day: slot.date.toISOString().slice(0, 10),
          timeslots: timeslots.map((r) => ({
            timeFrom: `${r.from}:00`,
            timeUntil: `${r.to}:00`,
          })),
        };
      });
      console.log(mappedSlots);
      addAvailability(mappedSlots);
      toast.success("Availability added successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  useEffect(() => {
    getClasses();
    getAvailability();

    async function getClasses() {
      try {
        const today = new Date();
        const end = new Date();
        end.setDate(today.getDate() + 20);

        const startParam = today.toISOString().slice(0, 10);
        const endParam = end.toISOString().slice(0, 10);
        const data = await getTeacherUpcomingClasses(startParam, endParam);
        setClasses(data);
      } catch (e: any) {
        toast.error("Error getting classes");
      }
    }
    async function getAvailability() {
      try {
        const data = await getTeacherAvailability();
        setExistingAvailability(data);
      } catch (e: any) {
        toast.error("Error getting availability");
      }
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MenubarItem onSelect={(e) => e.preventDefault()}>
          Add availability
        </MenubarItem>
      </DialogTrigger>
      <DialogContent className={"min-w-5/7"}>
        <DialogHeader>
          <DialogTitle>Add availability</DialogTitle>
          <DialogDescription>
            Choose from upcoming days and select times students can set up
            classes.
          </DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <Schedule
            startDate={new Date()}
            daysCount={7}
            displayMode={"add"}
            onSelect={() => {
              //anytime a slot is modified, get info
            }}
            classes={classes}
            apiDayAvailability={existingAvailability}
          />
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => {
                setupAvailability();
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
