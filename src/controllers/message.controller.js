import MessageManagerDB from "../dao/managers/messageManagerMongoDB.js";

const mm = new MessageManagerDB()


export const getMessagesController = async (req, res) => {

    const result = await mm.getMessages()
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(200).json({ status: 'success', payload: result })
}

export const addMessageController = async (req, res) => {
    const newMessage = req.body
    const result = await mm.addMessage(newMessage)
    if (typeof result == 'string') {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) })
    }
    res.status(201).json({ status: 'success', payload: result })
}