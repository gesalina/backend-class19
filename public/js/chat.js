const socket = io()
let chat = document.getElementById('chatBox');

Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Set username for the Chat',
    inputValidator: value => {
        return !value.trim() && 'Please write a valid username'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    document.getElementById('user').innerHTML = user;
    chat.addEventListener('keyup', async(event) => {
        if(event.key === 'Enter'){
            if(chat.value.trim().length > 0){

                const body = {
                    user: user,
                    message: chat.value
                }
                await fetch('/api/chat/',{
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const getMessages = await fetch('/api/chat/');
                const result =await getMessages.json();
                socket.emit('messages', result);
                chat.value = ''
            }
        }
    })
});

socket.on('logs', data => {
    const logger = document.getElementById('messageLogs');
    let messages = '';
    console.log(data)
    data.forEach(message => {
        messages += `<p><i>${message.user}</i>: ${message.message}</p>`
    })
    console.log(messages)
    logger.innerHTML = messages;
})
