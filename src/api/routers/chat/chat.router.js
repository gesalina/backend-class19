import { Router } from "express";
import chatManager from "../../controllers/dao/ChatManager.js";

const router = Router();
const chat = new chatManager();

/**
* This endpoint show data about the chat
* return user and message
*/
router.get("/", async (request, response) => {
    const getMessages = await chat.getMessages();
    response.json(getMessages);
})
/**
* This endpoint insert data (user, message) on our messages collection
* and emit a websocket to get on realtime the message write for the
* users
*/
router.post("/",async (request, response) => {
    let data = request.body;
    const createMessage = await chat.insertMessage(data);
    request.app.get('socketio').emit('logs', createMessage);
    response.json({status: 'success', messages: createMessage});
})
export default router
