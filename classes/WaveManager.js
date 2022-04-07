import PubSub from "./utils/PubSub.js"
import EnemiesWave from "./EnemiesWave.js"

/** @var {EnemiesWave[]} */
let remainingWaves = []
let timer = 0
let timerIsRunning = false
let isRunning = false
/** @var {EnemiesWave|null} */
let currentWave = null
let currentWaveDefeatedSubscription
let currentNWave = 0
let textTimer = 0

function spawnNextWave() {
    // Stop the timer
    timerIsRunning = false

    // Unsubscribe from the previous wave events
    if (currentWaveDefeatedSubscription)
        currentWaveDefeatedSubscription.unsubscribe()

    // Inject the next wave and subscribe to the allEnemiesDefeated event to restart the timer
    currentWave = remainingWaves.shift()
    currentWaveDefeatedSubscription = currentWave.events.subscribe('allEnemiesDefeated', _ => timerIsRunning = true)
    timer = currentWave.delay

    // Start the wave
    currentWave.start()

    // Make the next wave text appear
    currentNWave++
    textTimer = 3
}

export const WaveManagerEvents = new PubSub();

export default {
    addWave(pWave) {
        remainingWaves.push(pWave)
    },

    run() {
        isRunning = true

        if (currentWave === null) {
            if (remainingWaves.length === 0)
                WaveManagerEvents.publish('allWavesDefeated')
            else
                spawnNextWave()
        }
    },

    stop () {
        isRunning = false
    },

    update(pDt) {
        if (!isRunning) return
        currentWave.update(pDt)

        if (timerIsRunning) {
            timer -= pDt
            if (timer <= 0) spawnNextWave()
        }

        if (textTimer > 0) textTimer -= pDt
    },

    fixedUpdate(pFixedDt) {
        if (currentWave === null) return
        currentWave.fixedUpdate(pFixedDt)
    },

    draw(pCtx) {
        currentWave.draw(pCtx)
        if (textTimer > 0) {
            pCtx.font = 'sans-serif 50px'
            pCtx.fontWeight = '900'
            pCtx.textAlign = 'center'
            pCtx.fillText(`Starting wave ${currentNWave}`, 480, 300)
        }
    }
}