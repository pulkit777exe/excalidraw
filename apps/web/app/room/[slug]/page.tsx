import axios from "axios";
import ChatRoom from "../../../components/ChatRoom";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getRoom(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
  return response.data.room.id;
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const roomId = await getRoom(slug);

  return <ChatRoom id={roomId} />;
}