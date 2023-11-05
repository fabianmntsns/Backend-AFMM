import { Router } from "express"
import { addMessageController, getMessagesController } from "../controllers/message.controller.js"

const router = Router()

router.get('/', getMessagesController)

router.post('/', addMessageController)

export default router