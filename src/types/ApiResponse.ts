import { Message, User } from "@/model/User";

export default interface ApiResponse {
  success: boolean;
  message: string;
  user?: User;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
