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
import { useUser } from "@/features/user/UserContext.tsx";
import type { User } from "@/features/user/user.ts";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { getRoles } from "@/api/api.ts";
import { acceptSpectatorInvite } from "@/api/api calls/apiSpectators.ts";

let loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});

export function UserSheetContentLogIn({
  switchToRegister,
}: {
  switchToRegister: () => void;
}) {
  let { setUser } = useUser();
  let form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(userData: z.infer<typeof loginSchema>) {
    try {
      const resLogin = await loginUser(userData);
      const resUser = await aboutMe();
      const resRoles = getRoles();

      const user: User = {
        name: resUser.name,
        surname: resUser.surname,
        roles: resRoles,
        activeRole: resRoles[0],
      };

      setUser(user);

      const token = Cookies.get("spectatorInviteToken");
      if (!token) return;

      try {
        await acceptSpectatorInvite(token);
        toast.success("Invitation accepted.");
      } catch {
        toast.error("Could not accept invitation.");
      } finally {
        Cookies.remove("spectatorInviteToken");
      }
    } catch (e: any) {
      if (e.message.endsWith("400")) {
        toast.error("Check your email and password");
      } else {
        toast.error(e.message);
      }

      // form.setError("root", { message: e.message });
    }
  }

  return (
    <div className="inline-flex flex-col gap-6 p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"flex flex-col gap-4"}
        >
          {/*<FormField*/}
          {/*  name="role"*/}
          {/*  render={({ field }) => (*/}
          {/*    <FormItem>*/}
          {/*      <FormLabel>Log in as:</FormLabel>*/}
          {/*      <FormControl>*/}
          {/*        <RadioGroup*/}
          {/*          className={"flex flex-row"}*/}
          {/*          onValueChange={field.onChange}*/}
          {/*          value={field.value}*/}
          {/*          defaultValue={"student"}*/}
          {/*        >*/}
          {/*          <RadioGroupItem value={"student"} id={"student"} />*/}
          {/*          <Label htmlFor={"student"}>Student</Label>*/}
          {/*          <RadioGroupItem value={"teacher"} id={"teacher"} />*/}
          {/*          <Label htmlFor={"teacher"}>Teacher</Label>*/}
          {/*        </RadioGroup>*/}
          {/*      </FormControl>*/}
          {/*    </FormItem>*/}
          {/*  )}*/}
          {/*/>*/}
          <FormField
            control={form.control}
            name="email"
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
            name="password"
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
            <Button variant="outline" type="button" onClick={switchToRegister}>
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
