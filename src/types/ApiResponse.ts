import { User } from "@/model/User";
import {Message} from "@/model/Message";


export default interface ApiResponse {
  success: boolean;
  message: string;
  user?: User;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
