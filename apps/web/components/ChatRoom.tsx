import axios from "axios"
import { ChatRoomClient } from "./ChatRoomClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getChat (roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    return response.data.messages;
}


export default async function ChatRoom ({id} : {
    id : string
}) {
    const Messages = await getChat(id);

    return <ChatRoomClient id={id} messages={Messages}/>
}