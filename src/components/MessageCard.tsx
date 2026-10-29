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
import { useState } from "react";
import { toast } from "./ui/toast";
import axios from "axios";
import ApiResponse from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

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
    <Card className="h-full rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/5">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Anonymous message</CardTitle>
        <CardAction>
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
      <CardContent className="flex-1">
        <p className="whitespace-pre-wrap break-words leading-relaxed text-zinc-800">
          {message.content}
        </p>
      </CardContent>
      <CardFooter className="text-xs text-zinc-500">
        {new Date(message.createdAt).toLocaleString()}
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
