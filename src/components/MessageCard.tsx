"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/Message";
import { useEffect, useRef, useState } from "react";
import { toast } from "./ui/toast";
import axios from "axios";
import ApiResponse from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const messageDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = messageDialogRef.current;
    if (!dialog) return;

    if (isMessageOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isMessageOpen && dialog.open) {
      dialog.close();
    }
  }, [isMessageOpen]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      toast.add({
        type: "success",
        title: response.data.message,
      });
      onMessageDelete(message._id.toString());
    } catch (error) {
      console.error("Error deleting message", error);
      const errorMsg = axios.isAxiosError<ApiResponse>(error)
        ? (error.response?.data.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to delete message.";
      toast.add({
        type: "error",
        title: "Unable to delete message",
        description: errorMsg,
        priority: "high",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="relative h-full rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/5 transition-colors hover:bg-lime-50">
      <button
        type="button"
        aria-label="Open full anonymous message"
        aria-haspopup="dialog"
        onClick={() => setIsMessageOpen(true)}
        className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime-600"
      />
      <CardHeader className="pointer-events-none relative z-10 grid-cols-[1fr_auto]">
        <CardTitle>Anonymous message</CardTitle>
        <CardAction className="pointer-events-auto relative z-20">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete message"
                  disabled={isDeleting}
                  className="text-zinc-500 hover:text-red-600"
                >
                  <X className="size-4" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This message will be permanently removed from your inbox.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
      <CardContent className="pointer-events-none relative z-10 flex-1">
        <p className="line-clamp-4 whitespace-pre-wrap break-words leading-relaxed text-zinc-800">
          {message.content}
        </p>
      </CardContent>
      <CardFooter className="pointer-events-none relative z-10 text-xs text-zinc-500">
        {new Date(message.createdAt).toLocaleString()}
      </CardFooter>
      <dialog
        ref={messageDialogRef}
        aria-labelledby={`message-title-${String(message._id)}`}
        onClose={() => setIsMessageOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsMessageOpen(false);
          }
        }}
        className="m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-950 shadow-2xl backdrop:bg-zinc-950/40"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4">
          <div>
            <h2
              id={`message-title-${String(message._id)}`}
              className="text-lg font-bold"
            >
              Anonymous message
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close message"
            onClick={() => setIsMessageOpen(false)}
            className="shrink-0 text-zinc-500 hover:text-zinc-900"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="max-h-[calc(85vh-5rem)] overflow-y-auto px-5 py-4">
          <p className="whitespace-pre-wrap break-words leading-relaxed text-zinc-800">
            {message.content}
          </p>
        </div>
      </dialog>
    </Card>
  );
};

export default MessageCard;
