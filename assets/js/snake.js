
class SnakeGame {
    #canvas
    #ctx
    #grid
    #snake
    #apple
    #dir
    #nextDir
    #score
    #record
    #alive
    #lastFrameTime = 0
    #tileSize = 20
    #boundLoop

  constructor(canvas) {
    this.#canvas = canvas
    this.#ctx = canvas.getContext("2d")
    this.#grid = {
      width: canvas.width,
      height: canvas.height,
      count: canvas.width / this.#tileSize
    }
    this.#record = parseInt(localStorage.getItem("snakeRecord")) || 0
    this.#boundLoop = this.#loop.bind(this)
    this.#setupControls()
    this.reset()
  }

  reset() {
    this.#snake = [{ x: 5, y: 5 }]
    this.#dir = { x: 1, y: 0 }
    this.#nextDir = { x: 1, y: 0 }
    this.#score = 0
    this.#alive = true
    this.#spawnApple()
    this.#draw()
    this.#lastFrameTime = 0
    requestAnimationFrame(this.#boundLoop)
  }

  #spawnApple() {
    do {
      this.#apple = {
        x: Math.floor(Math.random() * this.#grid.count),
        y: Math.floor(Math.random() * this.#grid.count)
      }
    } while (this.#snake.some(s => s.x === this.#apple.x && s.y === this.#apple.y))
  }

  #loop(time) {
    if (!this.#alive) return
    if (time - this.#lastFrameTime >= 120) {
      this.#lastFrameTime = time
      this.#update()
      this.#draw()
    }
    requestAnimationFrame(this.#boundLoop)
  }

  #update() {
    this.#dir = this.#nextDir
    const head = {
      x: this.#snake[0].x + this.#dir.x,
      y: this.#snake[0].y + this.#dir.y
    }

    // collision
    if (
      head.x < 0 || head.y < 0 ||
      head.x >= this.#grid.count || head.y >= this.#grid.count ||
      this.#snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      this.#alive = false
      this.#ctx.fillStyle = "#f00"
      this.#ctx.font = "bold 30px sans-serif"
      this.#ctx.fillText("💀 GAME OVER", 60, this.#canvas.height / 2)
      return
    }

    this.#snake.unshift(head)

    if (head.x === this.#apple.x && head.y === this.#apple.y) {
      this.#score++
      document.getElementById("score").textContent = this.#score
      if (this.#score > this.#record) {
        this.#record = this.#score
        localStorage.setItem("snakeRecord", this.#record)
        document.getElementById("record").textContent = this.#record
      }
      this.#spawnApple()
      new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg").play()
    } else {
      this.#snake.pop()
    }
  }

  #draw() {
    this.#ctx.fillStyle = "#000"
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)

    this.#ctx.fillStyle = "#0f0"
    for (const s of this.#snake) {
      this.#ctx.fillRect(s.x * this.#tileSize, s.y * this.#tileSize, this.#tileSize, this.#tileSize)
    }

    this.#ctx.fillStyle = "#f00"
    this.#ctx.fillRect(this.#apple.x * this.#tileSize, this.#apple.y * this.#tileSize, this.#tileSize, this.#tileSize)
  }

  #setupControls() {
    window.addEventListener("keydown", (e) => {
      const dirMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
      }
      const d = dirMap[e.key]
      if (d && (d.x !== -this.#dir.x || d.y !== -this.#dir.y)) {
        this.#nextDir = d
      }
    })

    // Touch control
    let startX = 0, startY = 0
    window.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    })
    window.addEventListener("touchmove", e => {
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY
      if (Math.abs(dx) > Math.abs(dy)) {
        this.#nextDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }
      } else {
        this.#nextDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 }
      }
      startX = startY = 0 // prevent multi-move
    })
  }

  stop() {
    this.#alive = false
    window.removeEventListener("keydown", this.#setupControls)
    window.removeEventListener("touchstart", this.#setupControls)
    window.removeEventListener("touchmove", this.#setupControls)
    cancelAnimationFrame(this.#boundLoop)
  }
  start() {
    if (!this.#alive) {
      this.reset()
    }
  }
  getState() {
    return {
      snake: this.#snake,
      apple: this.#apple,
      score: this.#score,
      record: this.#record,
      alive: this.#alive
    }
  }
  setState(state) {
    this.#snake = state.snake
    this.#apple = state.apple
    this.#score = state.score
    this.#record = state.record
    this.#alive = state.alive
    document.getElementById("score").textContent = this.#score
    document.getElementById("record").textContent = this.#record
    this.#draw()
  }
  isRunning() {
    return this.#alive;
  }
}
