var game = null;

window.addEventListener('load', () => {
    const pongCanvas = document.getElementById('pong');
    const snakeCanvas = document.getElementById('snake');
    const tttCanvas = document.getElementById('tictactoe');
    const placeholderCanvas = document.getElementById('placeholder');
    
    const gamesMap = {
        pong:() => {
            game = new PongGame(document.getElementById("pong"));
            document.getElementById("record").textContent = localStorage.getItem("pongRecord") || "0";
            document.getElementById("restart").onclick = () => {
                document.getElementById("score").textContent = "0";
                game.reset();
            }
        },
        snake: () => {
            game = new SnakeGame(document.getElementById("snake"));
            document.getElementById("record").textContent = localStorage.getItem("snakeRecord") || "0";
            document.getElementById("restart").onclick = () => {
                document.getElementById("score").textContent = "0";
                game.reset();
            }
        },
        tttGame: () => {
            game = new TicTacToe(document.getElementById("tictactoe"));
            document.getElementById("record").textContent = localStorage.getItem("tttRecord") || "0";
            document.getElementById("restart").onclick = () => {
                game.reset();
            }
        }
    };
    const gamesCtl = {
        stopGame: () => {
            if (game) {
                game.stop();
                game = null;
            }
            // Mostra placeholder
            canvasCtl.showOnlyCanvas('placeholder');
        },
        showGame: (gameType) => {
            stopGame(); // Para qualquer jogo em execução e mostra placeholder
            buttonsCtl.resetButtonStyles();
            // Mostra apenas o canvas do jogo selecionado
            canvasCtl.showOnlyCanvas(gameType);
            switch (gameType) {
                case 'pong':
                    gamesMap.pong();
                    break;
                case 'snake':
                    gamesMap.snake();
                    break;
                case 'tictactoe':
                    gamesMap.tttGame();
                    break;
                default:
                    canvasCtl.showOnlyCanvas('placeholder');
                    console.error('Jogo desconhecido:', gameType);
            }
        }
    };
    const buttonsCtl = {
        resetButtonStyles: () => {
            const buttons = document.querySelectorAll('.btns button');
            buttons.forEach(button => {
                buttonsCtl.unhighlightButton(button);
            });
        },
        highlightButton: (button) => {
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
        },
        unhighlightButton: (button) => {
            button.style.backgroundColor = '';
            button.style.color = '';
        },
        resetButtonStyles: () => {
            const buttons = document.querySelectorAll('.btns button');
            buttons.forEach(button => {
                buttonsCtl.unhighlightButton(button);
            });
        },
        highlightSelectedButton: (gameType) => {
            const buttons = document.querySelectorAll('.btns button');
            buttons.forEach(button => {
                if (button.textContent.toLowerCase() === gameType.toLowerCase()) {
                    buttonsCtl.highlightButton(button);
                } else {
                    buttonsCtl.unhighlightButton(button);
                }
            });
        }
    };
    const canvasCtl = {
        showOnlyCanvas: (canvasId) =>{
            const canvases = document.querySelectorAll('.game-canvas');
            canvases.forEach(canvas => {
                if (canvas.id === canvasId) {
                    canvas.classList.remove('hidden');
                } else {
                    canvas.classList.add('hidden');
                }
            });
        },
        resizeCanvas: (canvas) => {
            const aspectRatio = 16 / 9;
            const width = window.innerWidth * 0.8;
            const height = width / aspectRatio;
            canvas.width = width;
            canvas.height = height;
        }
    };
    const setEventListeners = () => {
        document.querySelectorAll('.btns button').forEach(button => {
            button.addEventListener('click', (event) => {
                const gameType = event.target.dataset.game;
                gamesCtl.showGame(gameType);
                buttonsCtl.highlightSelectedButton(gameType);
            });
        });
        window.addEventListener('resize', () => {
            canvasCtl.resizeCanvas(pongCanvas);
            canvasCtl.resizeCanvas(snakeCanvas);
            canvasCtl.resizeCanvas(tttCanvas);
            canvasCtl.resizeCanvas(placeholderCanvas);
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                stopGame();
                buttonsCtl.resetButtonStyles();
            }
        });
        // Remove evento de clique fora dos jogos para não sumir o container
    };

    canvasCtl.resizeCanvas(pongCanvas);
    canvasCtl.resizeCanvas(snakeCanvas);
    canvasCtl.resizeCanvas(tttCanvas);
    canvasCtl.resizeCanvas(placeholderCanvas);

    setEventListeners();

    // Mostra placeholder por padrão
    canvasCtl.showOnlyCanvas('placeholder');
});

