import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider } from "@/components/ui/divider.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Input } from "@/components/ui/input.tsx";
import { registerUser } from "@/api/auth.ts";

let RegistrationSchema = z
  .object({
    accountType: z.enum(["student", "teacher"]),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
    name: z.string().min(1, { message: "Name cannot be empty" }),
    surname: z.string().min(1, { message: "Surname cannot be empty" }),
    phone: z
      .string()
      .trim()
      .min(9, { message: "Telephone must be at least 9 characters long" }),
    aboutMe: z
      .string()
      .trim()
      .max(200, { message: "About Me must be at most 200 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function UserSheetContentRegister({
  onCancel,
  onRegister,
}: {
  onCancel: () => void;
  onRegister: () => void;
}) {
  let form = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      accountType: "student",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      surname: "",
      phone: "",
      aboutMe: ""
    },
  });

  async function onSubmit(data: z.infer<typeof RegistrationSchema>) {
    try {
      await registerUser(data);
      onRegister();
    } catch (e: any) {
      form.setError("root", {
        message: e.message || "Registration failed. Please try again.",
      });
    }
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={"flex flex-col gap-4 p-8"}
      >
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value}>
                  <div className={"flex gap-2"}>
                    <FormLabel>Account type:</FormLabel>
                    {["student", "teacher"].map((value) => (
                      <Button
                        type={"button"}
                        key={value}
                        onClick={() => field.onChange(value)}
                        variant={field.value === value ? "default" : "outline"}
                      >
                        {value === "student" ? (
                          <icons.StudentIcon />
                        ) : (
                          <icons.TeacherIcon />
                        )}
                        {value}
                      </Button>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email: </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@hotmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password: </FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password: </FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Divider />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name: </FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname: </FormLabel>
              <FormControl>
                <Input placeholder="Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telephone number: </FormLabel>
              <FormControl>
                <Input type={"tel"} placeholder="000 000 000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aboutMe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Me: </FormLabel>
              <FormControl>
                <Input placeholder="I love fishing..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-center">
          <Button type="button" variant={"outline"} onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button type="submit" variant={"default"}>
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
