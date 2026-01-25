import { AuthComponent } from "../components/AuthComponent";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "../hooks/useLogin";
import Link from "next/link";

export default function LoginPage() {
  const { form, onSubmit } = useLogin();
  return (
    <AuthComponent>
      <div className="w-full">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Forgot */}
            <div className="text-sm text-right">
              <Link href="#" className="text-accent hover:underline">
                Forgot your password?
              </Link>
            </div>

            {/* Button */}
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
        </Form>
      </div>
    </AuthComponent>
  );
}
