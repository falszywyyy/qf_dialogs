local callback = nil

local function sendDialogNpcSync(npcName, npcQuestion, dialogOptions)
    while callback ~= nil do
        Citizen.Wait(0)
    end
    local hasCancel = false
    for _, v in ipairs(dialogOptions) do
        if v.id == "cancel" then
            hasCancel = true
            break
        end
    end

    if not hasCancel then
        table.insert(dialogOptions, {
            id = "cancel",
            text = exports.qf_carthief:CancelTalk() or "However, I dont want to talk to you",
            disabled = false
        })
    end
    local dialog = {
        npc = {
            name = npcName,
            question = npcQuestion,
            avatar = ""
        },
        dialogs = dialogOptions
    }

    SendNUIMessage({
        action = 'npcDialog',
        data = dialog
    })
    SetNuiFocus(true, true)
    local returnedData = false
    local dataCallback = function(data) 
        returnedData = data
        SetNuiFocus(false, false)
        callback = nil
    end
    callback = dataCallback

    while returnedData == false do
        Citizen.Wait(0)
    end
    return returnedData
end

RegisterNUICallback('response', function(data, cb)
    if callback then
        callback(data)
    end
    cb('ok')
end)

exports('sendDialogNpcSync', sendDialogNpcSync)
