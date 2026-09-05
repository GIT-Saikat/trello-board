import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APITester } from "./APITester";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";
import {Routes, Route, BrowserRouter, useParams} from "react-router";
import { useEffect, useState } from "react";

export function App() {
  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      <BrowserRouter>
        <Routes>
          <Route path="/board/:boardId" element={<Board />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function Board() {
  
  const { boardId} = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3002");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.type === "initial_state"){
        setUsers(data.users);
      }

      if(data.type === "join"){
        setUsers(previousUsers => [...previousUsers, data.userId]);
      }

      if(data.type === "leave"){
        setUsers(previousUsers => previousUsers.filter(u => u !== data.userId));
      }  
    }

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        boardId: boardId
      }))
    }
  },[])

  
  return <div>
    You are on board {boardId}

    Currently Active users - {JSON.stringify(users)}
  </div>
}

export default App;
