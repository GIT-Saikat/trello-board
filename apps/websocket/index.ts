import { WebSocketServer } from "ws";
import { prisma } from "db/client";

const server = new WebSocketServer({port:3002});

const ROOMS: any = {

}

server.on("connection", (socket) => {
    socket.on("message", (data) => {
        const parsedData = JSON.parse(data);

        if (parsedData.type === "join"){
            const boardId = parsedData.boardId;
            if (!ROOMS[boardId]){
                ROOMS[boardId] = [];
            }
            const newUserId = Math.random();

            for(let i = 0; i < ROOMS[boardId].length;i++){
                const user = ROOMS[boardId][i];
                user.socket.send(JSON.stringify({
                    type: "join",
                    userId: newUserId
                }))
            }

            ROOMS[boardId].push({userId: newUserId, socket: socket});

            socket.send(JSON.stringify({
                type: "initial_state",
                user: ROOMS.filter(x => x.id != newUserId).map(u => u.id)
            }))

        }
    })

    socket.on("close", () => {
        Object.entries(ROOMS).map(([roomId, users]){
            const usersExist = users.find(u => u.socket == socket)
            if (usersExist){
                users =  users.filter( x=> x.socket = socket);
                users.forEach(({socket}) =>{
                    socket.send(JSON.stringify({
                        type: "leave",
                        userId: usersExist.id
                    }))
                })
            }
        })
    })
})


// incoming --- Connection, {join: "boardId", current-users}
//outgoing ---  initial_state or current users, join, leave