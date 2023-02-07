document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener("keydown", flap, false)
    if (sessionStorage.getItem('score')){
        document.getElementById('hiscore').innerText= "High score: " + sessionStorage.getItem('score')
    }
})

function clicked(){
    console.log('clicked')
    y+= dy;
}

function flap(e){
    if (e.key ===" "){
        spacePressed = true
    }
}

function unflap(e){
    spacePressed = false
}
let canvas = document.getElementById('gameCanvas')
let ctx = canvas.getContext('2d')

let spacePressed = false
var ballRadius = 10
var x = canvas.width/4
var y = canvas.height-200
var dx = 2
var dy = 3 

let difficulty = 30
let gap = canvas.heigh - difficulty
let flapped = 0
let barx = canvas.width - 100
let bary = 100
let score = 0
// y = a(t)^2 + v(t) + h

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawObstacles(){
    let gaptop = Math.random()*canvas.heigh
    let gapbottom = gaptop - gap

    let barWidth = 10
    let barHeight = gap
    ctx.beginPath();
    ctx.rect(barx, bary, 100, 100);
    ctx.fillStyle = "#95dd00";
    ctx.fill();
    ctx.closePath();
}

function endgame() {
    alert("GAME OVER")
    document.location.reload()
    clearInterval(interval)
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawObstacles()
    drawBall();
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {endgame()}

    if ((y < bary || y > bary + 100) && (barx < x)) {endgame()}
    if (spacePressed){
        flapped = 40
        spacePressed = false
    }
    if (flapped > 0) {
        y -= 20
        flapped -= 1
    } else {
        y += dy 
    }

    flapped -= 10
    barx -= 7
    if (barx < 0) {
        barx = canvas.width
        bary = Math.random()*(canvas.height - 2*difficulty)
        score += 1
        document.getElementById('score').innerText= "Score: " + score
        if (score > sessionStorage.getItem('score')) {
            sessionStorage.setItem('score', score)
        }
    }
}

let interval = setInterval(draw, 10);