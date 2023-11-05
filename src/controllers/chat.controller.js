export const chatViewController = async (req, res) => {
    const messagesList = await mm.getMessages()

    res.render("chat", { messagesList })


}