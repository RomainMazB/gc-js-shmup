/**
 * These 3 functions reproduce the keypressed mechanism
 */
// Stores the keypressed keyCodes
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

// Return whether the keyCode is down or not
export const isKeyDown = searchedCode => downKeys.findIndex(keyCode => keyCode === searchedCode) !== -1

// Bind an event on the keydown event
export const keyDown = (keyCode, callback) =>
    document.addEventListener("keydown", e => {
        if (e.code === keyCode) callback(e)
    })

// Bind an event on the keyup event
export const keyUp = (keyCode, callback) =>
    document.addEventListener("keyup", e => {
        if (e.code === keyCode) callback(e)
    })

// Bind events on the keyup and keydown events
export const keyUpDown = (keyCode, callbackDown, callbackUp) => {
    keyDown(keyCode, callbackDown)
    keyUp(keyCode, callbackUp)
}