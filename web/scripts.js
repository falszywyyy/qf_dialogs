document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('main-container').style.display = 'none';

    const Post = async function (name, data) {
        try {
            let resp = await fetch(`https://${GetParentResourceName()}/${name}`, {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(data || {}),
            });
            if (!resp.ok) {
                return;
            }
            return await resp.json();
        } catch (err) { }
    };

    window.addEventListener('message', function (event) {
        let e = event.data;
        switch (e.action) {
            case 'npcDialog':
                document.getElementById('main-container').style.display = 'flex';
                document.getElementById('header-title').innerText = e.data.npc.name;
                document.getElementById('header-subtitle').innerText = e.data.npc.question;
    
                const actionBoxes = document.getElementById('action-boxes');
                actionBoxes.innerHTML = '';
                e.data.dialogs.forEach(option => {
                    const actionBox = document.createElement('div');
                    actionBox.classList.add('action-box');
                    actionBox.id = option.id;
                    actionBox.innerHTML = `<p class="action-text">${option.text}</p>`;
                    actionBox.onclick = function() {
                        Post('response', { id: option.id });
                        document.getElementById('main-container').style.display = 'none';
                    };
                    actionBoxes.appendChild(actionBox);
                });
                break;
            case 'CloseDialog':
                document.getElementById('main-container').style.display = 'none';
                break;
            default:
                break;
        }
    });    
});
