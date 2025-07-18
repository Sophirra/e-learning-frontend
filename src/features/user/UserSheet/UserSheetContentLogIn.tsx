import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {FormControl, FormField, FormItem, FormLabel, FormMessage, Form} from "@/components/ui/form.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginUser} from "@/api/auth.ts";

let loginSchema = z.object({
    email: z.string().email({message: "Invalid email"}),
    password: z.string()
})

export function UserSheetContentLogIn({onRegister}: { onRegister: () => void}){
    let form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    async function onSubmit(userData: z.infer<typeof loginSchema>) {
        try {
            let {accessToken, refreshToken} = await loginUser(userData)
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)
            window.location.reload()
        } catch (e: any) {
            form.setError("root", {message: e.message})
        }
    }

    return (<div className="inline-flex flex-col gap-6 p-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={"flex flex-col gap-4"}>
                    <FormField control={form.control} name="email" render={({field}) =>(
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" placeholder="E-mail"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({field}) =>(
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" placeholder="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" type="button" onClick={onRegister}>Register</Button>
                        <Button variant="default" type="submit" >Log in</Button>
                    </div>
                </form>
            </Form>
    </div>
    )
}