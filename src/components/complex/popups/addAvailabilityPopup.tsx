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
} from "@/api/api calls/apiTeacher.ts";
import { useEffect, useState } from "react";
import type { ApiDayAvailability, ClassSchedule } from "@/types.ts";
import Schedule from "@/components/complex/calendar/schedules/schedule.tsx";
import { getTeacherUpcomingClasses } from "@/api/api calls/apiClasses.ts";

export function AddAvailabilityPopup() {
  // const [slots, setSlots] = useState<selectedSlots[]>([]);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [existingAvailability, setExistingAvailability] = useState<
    ApiDayAvailability[]
  >([]);
  const [updateAvailability, setUpdateAvailability] = useState<
    ApiDayAvailability[]
  >([]);

  async function setupAvailability() {
    try {
      console.log("original:", existingAvailability);
      console.log("updated:", updateAvailability);

      setUpdateAvailability(
        updateAvailability.filter(
          (update: ApiDayAvailability, i: number) =>
            update !== existingAvailability[i],
        ),
      );
      await addAvailability(updateAvailability);
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
    <Dialog
      onOpenChange={() => {
        setUpdateAvailability([]);
      }}
    >
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
            updateDaySlots={(newAv: ApiDayAvailability) => {
              // console.log("update:", av);
              setUpdateAvailability((prev) => {
                const exists = prev.some((oldAv) => oldAv.day === newAv.day);
                if (exists) {
                  // console.log("exists in update:", prev);
                  return prev.map((oldAv) => {
                    if (oldAv.day === newAv.day) {
                      // console.log("setting newAv: ", newAv, oldAv);
                    }
                    return oldAv.day === newAv.day ? newAv : oldAv;
                  });
                }
                const existing = existingAvailability.find(
                  (ex) => ex.day === newAv.day,
                );
                // console.log("exists in existing:", existing);
                return [...prev, existing ? existing : newAv];
              });
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
