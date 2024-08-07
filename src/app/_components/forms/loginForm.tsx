/* eslint-disable react/no-children-prop */
"use client";

import login from "~/app/login/action";
import { Input } from "../form";
import Button from "../ui/button";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await login(value.email, value.password);
        if (!res) {
          toast.error("Incorrect email or password");
          form.reset();
        }

        router.push("/");
      } catch (error) {
        toast.error("Error logging in");
        console.error(error);
        form.reset();
      }
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <form
      className="flex w-[300px] flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      method="POST"
    >
      <form.Field
        name="email"
        validators={{
          onSubmit: z
            .string()
            .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Email is required"),
        }}
        children={(field) => (
          <>
            <Input
              id={field.name}
              type="text"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              label="Email"
              errorMessage={field.state.meta.errors.join(", ")}
            />
          </>
        )}
      />
      <form.Field
        name="password"
        validators={{
          onSubmit: z.string().min(1, "Password is required"),
        }}
        children={(field) => (
          <>
            <Input
              id={field.name}
              type="password"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              label="Password"
              errorMessage={field.state.meta.errors.join(", ")}
            />
          </>
        )}
      />
      <form.Subscribe
        children={() => (
          <>
            <div className="h-1"></div>
            <Button varian="primary" type="submit">
              Create account
            </Button>
          </>
        )}
      />
    </form>
  );
}
