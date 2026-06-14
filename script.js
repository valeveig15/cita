// ---- GIFs de gatitos (reemplaza estas URLs con las tuyas si queres) ----
const gifStages = [
"https://valeveig.github.io/cita/sticker_1.webp",
    "https://valeveig.github.io/cita/sticker_2.webp",
    "https://valeveig.github.io/cita/sticker_3.webp",
    "https://valeveig.github.io/cita/sticker_4.webp",
    "https://valeveig.github.io/cita/sticker_5.webp",
    "https://valeveig.github.io/cita/sticker_15.webp",
]

// ---- textos del boton NO ----
const noTexts = [
    "no se...",
    "mmm pero...",
    "si, pero...",
    "pero...",
    "...",
    "no",
]

// ---- subtitulos ----
const noSubs = [
    "Podemos salir a caminar o lo que sea",
    "me diverti la ultima vez, tu no?",
    "yo invito los dulces!",
    "si no venis voy a pasar frio...",
    "te estas equivocando de boton",
    "SE que elegiras lo correcto",
]

// ---- emojis voladores segun en que estado aprieta SI ----
// estado 0 (no dice "no se...")    → corazones
// estado 1 (no dice "mmm pero...") → estrellitas
// estado 2 (no dice "si, pero...") → brillitos
// estado 3 (no dice "pero...")     → confetti emoji
const floatieSets = [
    ["❤️","❤️","❤️","❤️","❤️","❤️","❤️"],
    ["✨","✨","✨","✨","✨","✨"],
    ["🫧","🫧","🫧","🫧","🫧","🫧"],
    ["🎉","🎉","🎉","🎉","🎉","🎉"],
]

// ---- toast al apretar SI antes de tiempo ----
const yesTease = [
    "proba primero el otro boton, es mas divertido",
    "dale al no una sola vez, prometido",
    "en serio, toca el no primero",
]

// ---- tamanios del titulo creciendo ----
const titleSizes = ['2.1rem','2.3rem','2.6rem','2.9rem','3.2rem','3.6rem']

let noCount = 0
let yesTeased = 0
let runawayOn = false
let musicPlaying = false

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn  = document.getElementById('no-btn')
const titleEl = document.getElementById('main-title')
const subEl   = document.getElementById('main-sub')
const music   = document.getElementById('bg-music')

// ---- estrellas de fondo ----
;(function() {
    const bg = document.getElementById('stars-bg')
    for (let i = 0; i < 90; i++) {
        const s = document.createElement('div')
        s.className = 'star'
        const sz = Math.random() * 2.5 + 0.5
        s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*4}s`
        bg.appendChild(s)
    }
})()

// ---- musica ----
music.volume = 0.3
music.muted = true
music.play().then(() => {
    music.muted = false
    musicPlaying = true
}).catch(() => {
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

// ---- floaties ----
function spawnFloatie(emoji) {
    const el = document.createElement('div')
    el.className = 'floatie'
    el.textContent = emoji
    el.style.left = Math.random() * 100 + 'vw'
    el.style.bottom = '-30px'
    const dur = 3 + Math.random() * 4
    el.style.animationDuration = dur + 's'
    el.style.animationDelay = Math.random() * 0.6 + 's'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), (dur + 1.5) * 1000)
}

function burstFloaties(set, count, continuous) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => spawnFloatie(set[Math.floor(Math.random() * set.length)]), i * 70)
    }
    if (continuous) {
        window._floatInterval = setInterval(() => {
            spawnFloatie(set[Math.floor(Math.random() * set.length)])
        }, 400)
    }
}

// ---- boton SI ----
function handleYes() {
    // si no apretaron no todavia: tease
    if (noCount === 0 && !runawayOn) {
        showToast(yesTease[Math.min(yesTeased, yesTease.length - 1)])
        yesTeased++
        return
    }

    const state = noCount

    if (state <= 3) {
        // floaties del set correspondiente
        const continuous = (state === 0) // corazones van para siempre
        burstFloaties(floatieSets[state], 20, continuous)
        setTimeout(() => showYes(), 300)
    } else {
        // estado 4+: directo con confetti
        showYes()
    }
}

function showToast(msg) {
    const t = document.getElementById('tease-toast')
    t.textContent = msg
    t.classList.add('show')
    clearTimeout(t._t)
    t._t = setTimeout(() => t.classList.remove('show'), 2800)
}

// ---- boton NO ----
function handleNo() {
    if (noCount < noTexts.length - 1) noCount++

    noBtn.textContent = noTexts[noCount]
    subEl.textContent = noSubs[Math.min(noCount, noSubs.length - 1)]
    titleEl.style.fontSize = titleSizes[Math.min(noCount, titleSizes.length - 1)]

    // SI crece
    const cur = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${cur * 1.25}px`
    const py = Math.min(17 + noCount * 4, 56)
    yesBtn.style.padding = `${py}px 0`

    // NO se encoge
    if (noCount >= 2) {
        const ns = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(ns * 0.85, 9)}px`
    }

    // cambia gif
    swapGif(gifStages[Math.min(noCount, gifStages.length - 1)])

    // runaway desde el 4to no
    if (noCount >= 4 && !runawayOn) {
        enableRunaway()
        runawayOn = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.style.transition = 'background 0.2s, left 0.18s ease, top 0.18s ease'
    runAway() // corre inmediatamente
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const bw = noBtn.offsetWidth
    const bh = noBtn.offsetHeight
    const maxX = window.innerWidth  - bw - margin
    const maxY = window.innerHeight - bh - margin
    noBtn.style.position = 'fixed'
    noBtn.style.zIndex   = '50'
    noBtn.style.left = `${Math.random() * maxX + margin / 2}px`
    noBtn.style.top  = `${Math.random() * maxY + margin / 2}px`
}

// ---- pantalla SI ----
function showYes() {
    document.getElementById('ask-screen').style.display = 'none'
    document.getElementById('yes-screen').style.display = 'flex'
    launchConfetti()
}

function launchConfetti() {
    const colors = ['#e2e2e2','#a0a0c0','#ffffff','#c0c0ff','#8888cc']
    confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.3 }, colors })
    const end = Date.now() + 5000
    const iv = setInterval(() => {
        if (Date.now() > end) { clearInterval(iv); return }
        confetti({ particleCount: 35, angle: 60,  spread: 55, origin: { x: 0, y: 0.65 }, colors })
        confetti({ particleCount: 35, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors })
    }, 300)
}
