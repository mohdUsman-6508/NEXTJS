import { Message } from "@/model/User.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}

// good practice to define types here in types folder
