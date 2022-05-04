/**
 * These 3 functions reproduce the keypressed mechanism
 */
// Stores the pressed keys keyCodes
let downKeys = []

// On keydown, add the keyCode to the downKeys array
document.addEventListener("keydown", e => {
    // Avoid duplication
    let downKeysIndex = downKeys.findIndex(keyCode => keyCode === e.code)
    if (downKeysIndex !== -1) return

    downKeys.push(e.code)
})

// On keyup, remove the keyCode from the downKeys array
document.addEventListener("keyup", e => {
    let downKeysIndex = downKeys.findIndex(keyCode => keyCode === e.code)
    downKeys.splice(downKeysIndex, 1)
})

// Clean up all stored downKeys when the windows lose the focus
window.addEventListener("blur", e => downKeys = [])

// Return whether the keyCode is down or not
const isKeyDown = searchedCode => downKeys.findIndex(keyCode => keyCode === searchedCode) !== -1

// Bind an event on the keydown event and return the event un-subscription
const keyDown = (keyCode, callback) => {
    let cb = e => {
        if (e.code === keyCode) callback(e)
    }

    document.addEventListener("keydown", cb)

    return {
        removeEvent: _ => document.removeEventListener("keydown", cb)
    }
}

// Bind an event on the keyup event and return the event un-subscription
const keyUp = (keyCode, callback) =>{
    let cb = e => {
        if (e.code === keyCode) callback(e)
    }

    document.addEventListener("keyup", cb)

    return {
        removeEvent: _ => document.removeEventListener("keyup", cb)
    }
}

// Bind events on the keyup and keydown events and return the event un-subscription
const keyUpDown = (keyCode, callbackDown, callbackUp) => {
    let up = keyDown(keyCode, callbackDown)
    let down = keyUp(keyCode, callbackUp)

    return {
        removeEvent: _ => {
            up.removeEvent()
            down.removeEvent()
        }
    }
}
