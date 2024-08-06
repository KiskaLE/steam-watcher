/* eslint-disable react/no-children-prop */
"use client";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { Input } from "../form";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import { api } from "~/trpc/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function SetupForm() {
  const registerMutation = api.user.register.useMutation();
  const router = useRouter();
  const setupForm = useForm({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate({
        email: value.email,
        password: value.password,
      });
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: z
        .object({
          email: z.string(),
          password: z.string(),
          passwordConfirmation: z.string(),
        })
        .superRefine(({ password, passwordConfirmation }, ctx) => {
          if (password !== passwordConfirmation) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Passwords do not match",
              path: ["passwordConfirmation"],
            });
          }
        }),
    },
  });

  useEffect(() => {
    if (registerMutation.isSuccess) {
      toast.success("Account created");
      void router.push("/");
    }
    if (registerMutation.isError) {
      toast.error(registerMutation.error.message);
    }
  }, [
    registerMutation.isError,
    registerMutation.isSuccess,
    router,
    registerMutation.error,
  ]);
  const formErrorMap = setupForm.useStore((state) => state.errorMap);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void setupForm.handleSubmit();
      }}
      method="POST"
      className="flex w-[300px] flex-col gap-2"
    >
      <setupForm.Field
        name="email"
        validators={{
          onChange: z
            .string()
            .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email"),
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
      <setupForm.Field
        name="password"
        validators={{
          onChange: z.string().min(6, "At least 6 characters"),
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
      <setupForm.Field
        name="passwordConfirmation"
        children={(field) => (
          <>
            <Input
              id={field.name}
              type="password"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              label="Password confirmation"
              errorMessage={formErrorMap?.onSubmit?.toString()}
            />
          </>
        )}
      />
      <setupForm.Subscribe
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
