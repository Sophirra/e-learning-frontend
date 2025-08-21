import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, aboutMe } from "@/api/auth.ts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import type { User } from "@/features/user/user.ts";

let loginSchema = z.object({
  Email: z.string().email({ message: "Invalid email" }),
  Password: z.string(),
});

export function UserSheetContentLogIn({ onLogin }: { onLogin: () => void }) {
  let { setUser } = useUser();
  let form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Email: "",
      Password: "",
    },
  });
  async function onSubmit(userData: z.infer<typeof loginSchema>) {
    try {
      let resLogin = await loginUser(userData);
      let resUser = await aboutMe();
      let user: User = {
        name: resUser.name,
        surname: resUser.surname,
        teacher: resLogin.roles.includes("teacher"),
        student: resLogin.roles.includes("student"),
      };
      console.log(user);
      setUser(user);
    } catch (e: any) {
      form.setError("root", { message: e.message });
    }
  }

  return (
    <div className="inline-flex flex-col gap-6 p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"flex flex-col gap-4"}
        >
          <FormField
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Log in as:</FormLabel>
                <FormControl>
                  <RadioGroup
                    className={"flex flex-row"}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={"student"}
                  >
                    <RadioGroupItem value={"student"} id={"student"} />
                    <Label htmlFor={"student"}>Student</Label>
                    <RadioGroupItem value={"teacher"} id={"teacher"} />
                    <Label htmlFor={"teacher"}>Teacher</Label>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="E-mail" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 justify-center">
            <Button variant="outline" type="button" onClick={onLogin}>
              Register
            </Button>
            <Button
              variant="default"
              type="submit"
              //onSubmit={() => onSubmit(form.getValues())}
            >
              Log in
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
