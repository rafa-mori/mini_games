
class PongGame {
    #paddle = { width: 12, height: 90 };
    #ball = { size: 16, x: 0, y: 0, speedX: 0, speedY: 0 };
    #player = { x: 20, y: 0 };
    #ai = { x: 0, y: 0 };
    #canvas;
    #ctx;

    #boundGameLoop;
    #boundHandleMouseMove;
    #boundHandleTouchMove;
    #animFrameId = null;

    constructor(canvas) {
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('Canvas inválido ou não encontrado.');
        }

        this.#canvas = canvas;
        this.#ctx = canvas.getContext('2d');
        this.#init();

        this.#boundGameLoop = this.#gameLoop.bind(this);
        this.#boundHandleMouseMove = this.#handleMouseMove.bind(this);
        this.#boundHandleTouchMove = this.#handleTouchMove.bind(this);

        this.#canvas.addEventListener('mousemove', this.#boundHandleMouseMove);
        this.#canvas.addEventListener('touchmove', this.#boundHandleTouchMove, { passive: false });
    }

    #init() {
        this.#player.x = 20;
        this.#ai.x = this.#canvas.width - this.#paddle.width - 20;
        this.#player.y = this.#canvas.height / 2 - this.#paddle.height / 2;
        this.#ai.y = this.#canvas.height / 2 - this.#paddle.height / 2;
        this.#resetBall();
    }

    #resetBall() {
        this.#ball.x = this.#canvas.width / 2 - this.#ball.size / 2;
        this.#ball.y = this.#canvas.height / 2 - this.#ball.size / 2;
        this.#ball.speedX = 6 * (Math.random() > 0.5 ? 1 : -1);
        this.#ball.speedY = 4 * (Math.random() * 2 - 1);
    }

    #drawRect(x, y, w, h, color = '#fff') {
        this.#ctx.fillStyle = color;
        this.#ctx.fillRect(x, y, w, h);
    }

    #drawBall(x, y, size, color = '#fff') {
        this.#ctx.fillStyle = color;
        this.#ctx.beginPath();
        this.#ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        this.#ctx.fill();
    }

    #update() {
        this.#ball.x += this.#ball.speedX;
        this.#ball.y += this.#ball.speedY;

        if (this.#ball.y <= 0 || this.#ball.y + this.#ball.size >= this.#canvas.height) {
            this.#ball.speedY *= -1;
        }

        if (
            this.#ball.x <= this.#player.x + this.#paddle.width &&
            this.#ball.y + this.#ball.size >= this.#player.y &&
            this.#ball.y <= this.#player.y + this.#paddle.height
        ) {
            this.#ball.x = this.#player.x + this.#paddle.width;
            this.#ball.speedX *= -1;
            const impact = ((this.#ball.y + this.#ball.size / 2) - (this.#player.y + this.#paddle.height / 2)) / (this.#paddle.height / 2);
            this.#ball.speedY += impact * 2;
        }

        if (
            this.#ball.x + this.#ball.size >= this.#ai.x &&
            this.#ball.y + this.#ball.size >= this.#ai.y &&
            this.#ball.y <= this.#ai.y + this.#paddle.height
        ) {
            this.#ball.x = this.#ai.x - this.#ball.size;
            this.#ball.speedX *= -1;
            const impact = ((this.#ball.y + this.#ball.size / 2) - (this.#ai.y + this.#paddle.height / 2)) / (this.#paddle.height / 2);
            this.#ball.speedY += impact * 2;
        }

        if (this.#ball.x < 0 || this.#ball.x > this.#canvas.width) {
            this.#resetBall();
        }

        const aiCenter = this.#ai.y + this.#paddle.height / 2;
        if (aiCenter < this.#ball.y + this.#ball.size / 2 - 10) {
            this.#ai.y += 4;
        } else if (aiCenter > this.#ball.y + this.#ball.size / 2 + 10) {
            this.#ai.y -= 4;
        }

        this.#ai.y = Math.max(0, Math.min(this.#canvas.height - this.#paddle.height, this.#ai.y));
    }

    #draw() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        this.#drawRect(this.#player.x, this.#player.y, this.#paddle.width, this.#paddle.height);
        this.#drawRect(this.#ai.x, this.#ai.y, this.#paddle.width, this.#paddle.height);

        for (let i = 0; i < this.#canvas.height; i += 30) {
            this.#drawRect(this.#canvas.width / 2 - 2, i, 4, 20, '#888');
        }

        this.#drawBall(this.#ball.x, this.#ball.y, this.#ball.size);
    }

    #gameLoop() {
        this.#update();
        this.#draw();
        this.#animFrameId = requestAnimationFrame(this.#boundGameLoop);
    }

    #handleMouseMove(e) {
        const rect = this.#canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        this.#player.y = Math.max(0, Math.min(this.#canvas.height - this.#paddle.height, mouseY - this.#paddle.height / 2));
    }

    #handleTouchMove(e) {
        e.preventDefault();
        const rect = this.#canvas.getBoundingClientRect();
        const touchY = e.touches[0].clientY - rect.top;
        this.#player.y = Math.max(0, Math.min(this.#canvas.height - this.#paddle.height, touchY - this.#paddle.height / 2));
    }

    start() {
        if (!this.#animFrameId) {
            this.#init();
            this.#gameLoop();
        }
    }

    stop() {
        this.#canvas.removeEventListener('mousemove', this.#boundHandleMouseMove);
        this.#canvas.removeEventListener('touchmove', this.#boundHandleTouchMove);
        if (this.#animFrameId) {
            cancelAnimationFrame(this.#animFrameId);
            this.#animFrameId = null;
        }
    }

    reset() {
        this.#init();
    }

    getState() {
        return {
            player: { ...this.#player },
            ai: { ...this.#ai },
            ball: { ...this.#ball }
        };
    }

    isRunning() {
        return this.#animFrameId !== null;
    }
}
