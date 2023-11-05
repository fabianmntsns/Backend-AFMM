import messageModel from "../models/messages.model.js";
import mongoose from "mongoose";


class MessageManagerDB {

    async getMessages() {
        try {
            return await messageModel.find({}).lean()

        } catch (e) {
            return "[400] " + e.message
        }

    }

    async addMessage(messageInfo) {
        try {
            const result = await messageModel.create(messageInfo)
            return this.getMessages()
        } catch (e) {
            return "[400] " + e.message
        }
    }
}

export default MessageManagerDB