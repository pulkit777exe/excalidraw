"use client"
import { useState } from "react";
import TopBar from "../components/TopBar";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  
  return (
    <div>
      <TopBar />
      <input type="text" name="" id="" onChange={(e) => setRoomId(e.target.value)}/>
      <button onClick={() => {}}>Join Room {roomId}</button>
    </div>
  );
}
