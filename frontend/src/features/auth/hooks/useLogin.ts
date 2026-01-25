import { useForm } from "react-hook-form";
import { LoginFormValues } from "../schema";
import { authClient, signIn } from "@/lib/auth-client";

export function useLogin() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await authClient.signIn.email(
      {
        email: values.email,
        // name: values.email.split("@")[0],
        password: values.password,
      },
      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      },
    );
    console.log(values);
  }

  return {
    form,
    onSubmit,
  };
}
