import { User } from "@/model/User";
import {Message} from "@/model/Message";


export default interface ApiResponse {
  success: boolean;
  message: string;
  user?: User;
  username?: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
