"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { redirect, useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import ApiResponse from "@/types/ApiResponse";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  //zod impl

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials-login", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(result);
    if (result?.error) {
      toast.add({
        type: "error",
        title: "Log In Failed",
        description: "Incorrect Username or Password",
        priority: "high",
      });
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
  };
  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-[#faf9f6] px-4 py-12">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-200/50 blur-3xl sm:size-[30rem]"
      />
      <Card className="relative w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5">
        <CardHeader className="gap-3 px-6 pt-8 text-center sm:px-8">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Pick up where you left off.
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            Sign in to see what people have been meaning to tell you.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-7 sm:px-8">
          <form
            id="form-rhf-input"
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="gap-5">
              <Controller
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-sm font-semibold"
                      htmlFor="form-rhf-input-username"
                    >
                      Username or email address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-username"
                      aria-invalid={fieldState.invalid}
                      className="h-11 rounded-xl px-3"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-sm font-semibold"
                      htmlFor="form-rhf-input-password"
                    >
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                      autoComplete="new-password"
                      className="h-11 rounded-xl px-3"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              type="submit"
              form="form-rhf-input"
              disabled={submitting}
              className="h-11 w-full rounded-xl bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing you in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t-0 bg-transparent px-6 pb-8 pt-0 sm:px-8">
          <p className="text-sm text-muted-foreground">
            New Here?{" "}
            <Link
              className="font-semibold text-foreground underline-offset-4 hover:underline"
              href={"/signup"}
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
