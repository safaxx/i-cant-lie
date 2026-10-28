"use client"

import { toast } from "@/components/ui/toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import axios, { AxiosError } from "axios";
import ApiResponse from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast.add({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/signin");
    } catch (error) {
      console.error("Error while verifying code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg = axiosError.response?.data.message;
      toast.add({
        type: "error",
        title: "Verification Failed",
        description: errorMsg,
        priority: "high",
      });
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 py-10">
      <Card className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5">
        <CardHeader className="gap-2 px-6 pt-8 text-center sm:px-8">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-base">
            Enter the verification code sent to your email.
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
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-sm font-semibold"
                      htmlFor="form-rhf-input-code"
                    >
                    Verification Code
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-code"
                      aria-invalid={fieldState.invalid}
                      placeholder="code"
                      autoComplete="one-time-code"
                      className="h-11 rounded-xl px-3 text-center tracking-[0.3em]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="px-6 pb-8 pt-0 sm:px-8">
          <Button
            type="submit"
            form="form-rhf-input"
            className="h-11 w-full rounded-xl text-sm font-semibold"
          >
            Verify account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyAccount;