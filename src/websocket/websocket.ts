import WebSocket, { WebSocketServer } from "ws";
import { Request } from 'express';
import mockDataMessages from '../utils/mockDB';

export let connectionsList: WebSocket[] = []

const ws = async (expressServer: any) => {

    const wss = new WebSocketServer({ noServer: true })
    expressServer.on('upgrade', (request: Request, socket: any, head: any) => {
        wss.handleUpgrade(request, socket, head, (websocket) => {
            wss.emit('connection', websocket, request);
        });
    });

    wss.on('connection', (websocketConnection: WebSocket, req: Request) => {

        try {
            connectionsList.push(websocketConnection)
            const connectionIndex = connectionsList.length - 1
            websocketConnection.on('message', async (message) => {
                try {
                    websocketConnection.send(JSON.stringify({
                        type: 'message-created',
                        text: message
                    }));

                } catch (error) {
                    console.log(error)
                }
            });
            websocketConnection.on('close', (message) => {
                connectionsList.splice(connectionIndex, 1)
            });
        } catch (error) {
            console.log(error)
        }
    });
    return wss;
};

export default ws;