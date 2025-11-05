// import {
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
//   Dialog,
//   DialogTrigger,
//   DialogContent,
// } from "@/components/ui/dialog.tsx";
// import { Button } from "@/components/ui/button.tsx";
// import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
// import { useEffect, useState } from "react";
// import type { FileData, FileTag } from "@/api/types.ts";
// import { Input } from "@/components/ui/input.tsx";
// import { cn } from "@/lib/utils.ts";
// import { Label } from "@radix-ui/react-label";
// import {
//   createTag as apiCreateTag,
//   checkTagName as apiCheckTagName,
// } from "@/api/apiCalls.ts";
//
// export function newTagPopup({
//   setTagOnCreation,
// }: {
//   setTagOnCreation?: (tag: FileTag) => void;
// }) {
//   const [nameError, setNameError] = useState<boolean>(false);
//   const [tagName, setTagName] = useState<string>("");
//
//   async function createTag() {
//     //should return tag id to create new tag for onCreation
//     const newTag: FileTag = await apiCreateTag(tagName);
//     setTagOnCreation && setTagOnCreation(newTag);
//   }
//
//   async function checkTagName(tagName: string) {
//     //zwraca boolean
//     return await apiCheckTagName(tagName);
//   }
//
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant={"ghost"}>
//           <icons.Plus />
//           New tag
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add new tag</DialogTitle>
//         </DialogHeader>
//         <div className={"flex flex-col gap-4"}>
//           <Label>Tag name</Label>
//           <Input
//             id={"tagname"}
//             onChange={async (e) => {
//               const newName = e.target.value;
//               setTagName(newName);
//               if (newName.trim() === "") {
//                 setNameError(true);
//               }
//               const nameExists = await checkTagName(newName);
//               setNameError(nameExists);
//             }}
//             className={cn(nameError ? "border-red-300" : "")}
//           ></Input>
//         </div>
//         <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
//           <DialogClose>
//             <Button>Cancel</Button>
//           </DialogClose>
//           <Button
//             variant={"outline"}
//             disabled={nameError}
//             onSelect={() => {
//               createTag();
//             }}
//           >
//             Confirm
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
