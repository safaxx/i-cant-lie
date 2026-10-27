"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
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

const page = () => {
  const [username, setUsername] = useState("");
  const [validUsernameMsg, setValidUsernameMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300);
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

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername) {
        setLoading(true);
        setValidUsernameMsg("");
        try {
          const response = await axios.get(
            `/api/validate-username?username=${debouncedUsername}`,
          );
          setValidUsernameMsg(response.data.message);
        } catch (error) {
          setValidUsernameMsg("Error checking username");
        } finally {
          setLoading(false);
        }
      }
    };
    checkUsername();
  }, [debouncedUsername]);

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
      let errorMsg = axiosError.response?.data.message;
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
    // <div className="flex justify-center items-center min-h-screen bg-gray-100">
    //   <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    //     <div className="text-center">
    //       <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
    //         Join ICL
    //       </h1>
    //       <p className="mb-4">Sign up to send what you can't say</p>
    //     </div>
    //     <form onSubmit={form.handleSubmit(onSubmit)}></form>
    //   </div>
    // </div>

    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Join ICL!</CardTitle>
        <CardDescription>Sign up to send what you can't say</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-username">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="skh2001"
                    autoComplete="username"
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  <FieldDescription>
                    This is your public display name. Must be between 3 and 10
                    characters. Must only contain letters, numbers, and
                    underscores.
                  </FieldDescription>
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-username">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="s.k@gmail.com"
                    autoComplete="email"
                  />
                  <FieldDescription></FieldDescription>
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
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-username">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="*****"
                    autoComplete="password"
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="form-rhf-input" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing you up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <div>
            <p>
              Already a member? <Link href={"/api/signin"}>Log In</Link>
            </p>
          </div>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default page;
