"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/model/Message";
import { acceptMessageSchema } from "@/schemas/acceptMessage";
import ApiResponse from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Copy, RefreshCw } from "lucide-react";
import z from "zod";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setSwitchLoading] = useState(false);
  const [profileURL, setProfileURL] = useState("");

  const handleDeleteMessage = (messageId: string) => {
    setMessages((currentMessages) =>
      currentMessages.filter((msg) => String(msg._id) !== messageId),
    );
  };
  const { data: session, status } = useSession();
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessageSetting = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      const isAcceptingMessages = response.data.isAcceptingMessages;
      if (typeof isAcceptingMessages !== "boolean") {
        throw new Error(
          "The server returned an invalid message acceptance status.",
        );
      }
      setValue("acceptMessages", isAcceptingMessages);
    } catch (error) {
      console.error("Error while fetching message settings", error);
      const errorMsg = axios.isAxiosError<ApiResponse>(error)
        ? (error.response?.data.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to fetch message settings.";
      toast.add({
        type: "error",
        title: "Unable to fetch message settings",
        description: errorMsg,
        priority: "high",
      });
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages ?? []);
      if (refresh) {
        toast.add({
          type: "success",
          title: "Refreshed Messages",
          description: "Showing Latest messages",
        });
      }
    } catch (error) {
      console.error("Error while fetching messages", error);
      const errorMsg = axios.isAxiosError<ApiResponse>(error)
        ? (error.response?.data.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to fetch messages.";
      toast.add({
        type: "error",
        title: "Unable to fetch messages",
        description: errorMsg,
        priority: "high",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessageSetting();
  }, [session, setValue, fetchAcceptMessageSetting, fetchMessages]);

  useEffect(() => {
    if (session?.user.username) {
      setProfileURL(
        `${window.location.origin}/u/${encodeURIComponent(session.user.username)}`,
      );
    }
  }, [session?.user.username]);

  const handleSwitchChange = async () => {
    const nextAcceptMessages = !acceptMessages;
    setSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: nextAcceptMessages,
      });
      setValue("acceptMessages", nextAcceptMessages);
      toast.add({ description: response.data.message });
    } catch (error) {
      console.error("Error while updating message settings", error);
      const errorMsg = axios.isAxiosError<ApiResponse>(error)
        ? (error.response?.data.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to update message settings.";
      toast.add({
        type: "error",
        title: "Unable to update message settings",
        description: errorMsg,
        priority: "high",
      });
    } finally {
      setSwitchLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileURL);
      toast.add({
        type: "success",
        title: "Copied!",
        description: "Your profile link is ready to share.",
      });
    } catch (error) {
      console.error("Error copying profile link", error);
      toast.add({
        type: "error",
        title: "Unable to copy link",
        description: "Please copy the link manually.",
        priority: "high",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[#faf9f6] text-sm text-zinc-500">
        Loading your dashboard...
      </div>
    );
  }

  if (!session?.user) {
    return <div>Please login to see your messages</div>;
  }

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#faf9f6]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="relative inline-block isolate text-sm font-semibold uppercase tracking-[0.14em] text-zinc-600">
              <span className="relative z-10">Your little corner</span>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 z-0 h-2 w-full -rotate-2 bg-lime-300 sm:h-3"
              />
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Hey, {session.user.name ?? session.user.username ?? "there"}
            </h1>
            <p className="mt-2 text-zinc-600">
              Here’s what people have been meaning to tell you.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchMessages(true)}
            disabled={loading}
            className="h-10 gap-2 rounded-xl border-zinc-300 bg-white px-4 shadow-sm"
          >
            <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </header>

        <section
          aria-labelledby="share-profile-heading"
          className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5 sm:p-6"
        >
          <div className="mb-4">
            <h2
              id="share-profile-heading"
              className="text-lg font-bold text-zinc-900"
            >
              Your profile link
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Share this link so people can send you anonymous messages.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              aria-label="Your profile link"
              value={profileURL}
              readOnly
              placeholder="Preparing your profile link..."
              className="h-10 rounded-xl border-zinc-200 bg-[#faf9f6]"
            />
            <Button
              onClick={copyToClipboard}
              disabled={!profileURL}
              className="h-10 gap-2 rounded-xl px-5"
            >
              <Copy className="size-4" />
              Copy link
            </Button>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-zinc-900">Accept messages</p>
              <p className="mt-1 text-sm text-zinc-600">
                {acceptMessages
                  ? "Your profile is open to new messages."
                  : "Your profile is not accepting new messages."}
              </p>
            </div>
            <Switch
              checked={acceptMessages ?? false}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              aria-label="Accept messages"
            />
          </div>
        </section>

        <section
          aria-labelledby="inbox-heading"
          className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5 sm:p-6"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2
                id="inbox-heading"
                className="text-xl font-bold tracking-tight text-zinc-900"
              >
                Your inbox
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {messages.length}{" "}
                {messages.length === 1 ? "message" : "messages"} and counting
              </p>
            </div>
          </div>

          {loading && messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-[#faf9f6] px-6 py-12 text-center text-sm text-zinc-500">
              Loading your messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-[#faf9f6] px-6 py-12 text-center">
              <p className="font-medium text-zinc-900">Your inbox is empty</p>
              <p className="mt-2 text-sm text-zinc-600">
                Share your profile link to start receiving anonymous messages.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {messages.map((message) => (
                <MessageCard
                  key={String(message._id)}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
