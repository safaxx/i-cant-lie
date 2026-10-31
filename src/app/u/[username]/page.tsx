"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import type ApiResponse from "@/types/ApiResponse";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Sparkles } from "lucide-react";

const SendMessagePage = () => {
  const params = useParams<{ username: string }>();
  const [profileStatus, setProfileStatus] = useState<
    "loading" | "ready" | "not-found" | "closed" | "error"
  >("loading");
  const [profileUsername, setProfileUsername] = useState(params.username);
  const [profileError, setProfileError] = useState("");
  const [sent, setSent] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const content = form.watch("content");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfileStatus = async () => {
      setProfileStatus("loading");
      try {
        const response = await axios.get<ApiResponse>("/api/send-message", {
          params: { username: params.username },
          signal: controller.signal,
        });

        setProfileUsername(response.data.username ?? params.username);
        setProfileStatus(
          response.data.isAcceptingMessages ? "ready" : "closed",
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        if (axios.isAxiosError<ApiResponse>(error)) {
          if (error.response?.status === 404) {
            setProfileStatus("not-found");
            return;
          }
          setProfileError(
            error.response?.data.message ??
              error.message ??
              "Unable to load this profile.",
          );
        } else {
          setProfileError(
            error instanceof Error
              ? error.message
              : "Unable to load this profile.",
          );
        }
        setProfileStatus("error");
      }
    };

    void fetchProfileStatus();
    return () => controller.abort();
  }, [params.username]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast.add({
        type: "success",
        title: "Message sent",
        description: "Your honest note is on its way.",
      });
      form.reset({ content: "" });
      setSent(true);
    } catch (error) {
      console.error("Error while sending message", error);
      const errorMsg = axios.isAxiosError<{ message?: string }>(error)
        ? (error.response?.data.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to send your message. Please try again.";
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setProfileStatus("closed");
        return;
      }
      toast.add({
        type: "error",
        title: "Failed to send message",
        description: errorMsg,
        priority: "high",
      });
    }
  };

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages");
      if (
        !response.data.success ||
        !Array.isArray(response.data.suggestions) ||
        response.data.suggestions.length !== 3 ||
        response.data.suggestions.some(
          (suggestion) => typeof suggestion !== "string" || !suggestion.trim(),
        )
      ) {
        throw new Error(
          response.data.message || "The server returned invalid suggestions.",
        );
      }
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching message suggestions", error);
      const errorMsg = axios.isAxiosError<ApiResponse>(error)
        ? (error.response?.data.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to load message suggestions.";
      toast.add({
        type: "error",
        title: "Suggestions unavailable",
        description: errorMsg,
        priority: "high",
      });
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    form.setValue("content", suggestion, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const renderUnavailable = (title: string, description: string) => (
    <Card className="w-full max-w-lg rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-base leading-7">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );

  return (
    <main className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-[#faf9f6] px-4 py-12">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-200/50 blur-3xl sm:size-[30rem]"
      />
      <div className="relative w-full max-w-lg">
        {profileStatus === "loading" &&
          renderUnavailable(
            "One moment…",
            "We’re checking whether this inbox is open.",
          )}
        {profileStatus === "not-found" &&
          renderUnavailable(
            "Profile not found",
            "This link may be incorrect, or this profile is no longer available.",
          )}
        {profileStatus === "closed" &&
          renderUnavailable(
            "Inbox is closed",
            `${profileUsername} isn’t accepting messages right now. Check back later.`,
          )}
        {profileStatus === "error" &&
          renderUnavailable(
            "Couldn’t load this profile",
            profileError || "Please refresh the page and try again.",
          )}

        {profileStatus === "ready" && (
          <Card className="w-full rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5">
            <CardHeader className="gap-3 px-6 pt-8 sm:px-8">
              <p className="relative isolate w-fit text-sm font-semibold uppercase tracking-[0.14em] text-zinc-600">
                <span className="relative z-10">A little more real</span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 z-0 h-2 w-full -rotate-2 bg-lime-300"
                />
              </p>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Send {profileUsername} a note.
              </CardTitle>
              <CardDescription className="text-base leading-7">
                A compliment, a confession, a question—whatever you’ve been
                meaning to say. It’s anonymous.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8 sm:px-8">
              {sent && (
                <p
                  role="status"
                  className="mb-5 rounded-xl bg-lime-50 px-4 py-3 text-sm font-medium text-lime-900"
                >
                  Your message was sent. Want to send another?
                </p>
              )}
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FieldGroup>
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="gap-2" data-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="text-sm font-semibold"
                          htmlFor="message-content"
                        >
                          Your anonymous message
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="message-content"
                          aria-invalid={fieldState.invalid}
                          aria-describedby={
                            fieldState.error
                              ? "message-count message-content-error"
                              : "message-count"
                          }
                          maxLength={400}
                          placeholder="icl, i’ve always..."
                          className="min-h-36 resize-y rounded-xl border-zinc-200 bg-[#faf9f6] px-3 py-3 text-base leading-6"
                        />
                        {fieldState.invalid && (
                          <FieldError
                            id="message-content-error"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchSuggestions}
                    disabled={suggestionsLoading}
                    className="h-9 gap-2 rounded-xl border-zinc-300 bg-white"
                  >
                    <Sparkles
                      className={
                        suggestionsLoading
                          ? "size-4 animate-pulse"
                          : "size-4"
                      }
                    />
                    {suggestionsLoading
                      ? "Thinking of ideas..."
                      : "Need an idea?"}
                  </Button>
                  {suggestions.length > 0 && (
                    <div
                      aria-label="Message suggestions"
                      className="flex flex-col gap-2"
                    >
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={`${index}-${suggestion}`}
                          type="button"
                          variant="outline"
                          onClick={() => useSuggestion(suggestion)}
                          className="h-auto justify-start rounded-xl border-zinc-200 bg-[#faf9f6] px-3 py-2 text-left text-sm font-normal whitespace-normal"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-zinc-500">
                    Keep it kind. Your name won’t be attached.
                  </p>
                  <p
                    id="message-count"
                    aria-live="polite"
                    className="shrink-0 text-xs text-zinc-500"
                  >
                    {content?.length ?? 0}/400
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-11 w-full rounded-xl bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  {form.formState.isSubmitting ? "Sending..." : "Send anonymously"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default SendMessagePage;
