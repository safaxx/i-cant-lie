"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
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

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [validUsernameMsg, setValidUsernameMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const usernameRef = useRef(username);
  const usernameCheckController = useRef<AbortController | null>(null);
  const router = useRouter();

  //zod impl

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsername = useDebounceCallback(
    useCallback(async (value: string) => {
      const controller = new AbortController();
      usernameCheckController.current = controller;
      setLoading(true);

      try {
        const response = await axios.get("/api/validate-username", {
          params: { username: value },
          signal: controller.signal,
        });
        if (usernameRef.current === value) {
          setValidUsernameMsg(response.data.message);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        if (usernameRef.current === value) {
          const message = axios.isAxiosError<ApiResponse>(error)
            ? error.response?.data.message
            : undefined;
          setValidUsernameMsg(message ?? "Error checking username");
        }
      } finally {
        if (!controller.signal.aborted && usernameRef.current === value) {
          setLoading(false);
        }
      }
    }, []),
    300,
  );

  useEffect(
    () => () => {
      checkUsername.cancel();
      usernameCheckController.current?.abort();
    },
    [checkUsername],
  );

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log(data);
    setSubmitting(true);
    try {
      const response = await axios.post("/api/signup", data);
      toast.add({
        type: "success",
        title: "Sign up successfull",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error while signing up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg = axiosError.response?.data.message;
      toast.add({
        type: "error",
        title: "Sign up failed",
        description: errorMsg,
        priority: "high",
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 py-10">
      <Card className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5">
        <CardHeader className="gap-2 px-6 pt-8 text-center sm:px-8">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Join ICL
          </CardTitle>
          <CardDescription className="text-base">
            Sign up to send what you can&apos;t say
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
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-sm font-semibold"
                      htmlFor="form-rhf-input-username"
                    >
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="skh2001"
                      autoComplete="username"
                      className="h-11 rounded-xl px-3"
                      onChange={(e) => {
                        field.onChange(e);
                        const value = e.target.value;
                        usernameRef.current = value;
                        setUsername(value);
                        checkUsername.cancel();
                        usernameCheckController.current?.abort();
                        setValidUsernameMsg("");
                        setLoading(false);
                        if (value) {
                          checkUsername(value);
                        }
                      }}
                    />
                    <FieldDescription className="text-xs leading-relaxed">
                      Your public display name. Use 3–10 letters, numbers, or
                      underscores.
                    </FieldDescription>
                    {(loading || validUsernameMsg) && (
                      <p
                        aria-live="polite"
                        className={`text-xs ${
                          validUsernameMsg === "This username is available"
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {loading ? "Checking username..." : validUsernameMsg}
                      </p>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-sm font-semibold"
                      htmlFor="form-rhf-input-email"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-email"
                      aria-invalid={fieldState.invalid}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
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
                      placeholder="Create a password"
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
              className="h-11 w-full rounded-xl text-sm font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing you up...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t-0 bg-transparent px-6 pb-8 pt-0 sm:px-8">
          <p className="text-sm text-muted-foreground">
            Already a member?{" "}
            <Link
              className="font-semibold text-foreground underline-offset-4 hover:underline"
              href={"/signin"}
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
