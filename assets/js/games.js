var game = null;

window.addEventListener('load', () => {
    const pongCanvas = document.getElementById('pong');
    const snakeCanvas = document.getElementById('snake');
    const tttCanvas = document.getElementById('tictactoe');
    
    const gamesMap = {
        pong: () => {
            game = new PongGame();
            game.start('pong');
            document.getElementById('record').textContent = localStorage.getItem('pongRecord') || '0';
            document.getElementById('restart').onclick = () => {
                document.getElementById('score').textContent = '0';
                game.reset();
            };
            document.getElementById('start').onclick = () => {
                game.start('pong');
            };
            document.getElementById('stop').onclick = () => {
                game.stop();
            };
            // Dificuldade
            const diffSelect = document.getElementById('pong-difficulty');
            if (diffSelect) {
                diffSelect.onchange = (e) => {
                    game.setDifficulty(e.target.value);
                };
                // Aplica a dificuldade inicial
                game.setDifficulty(diffSelect.value);
            }
        },
        snake: () => {
            game = new SnakeGame();
            game.start('snake');
            document.getElementById('record').textContent = game.record.load();
            document.getElementById('restart').onclick = () => {
                document.getElementById('score').textContent = '0';
                game.reset();
            };
        },
        tictactoe: () => {
            game = new TicTacToe(document.getElementById('tictactoe'));
            document.getElementById('record').textContent = game.record.load();
            document.getElementById('restart').onclick = () => {
                game.reset();
            };
        }
    };
    const gamesCtl = {
        stopGame: () => {
            if (game && typeof game.stop === 'function') {
                game.stop();
                game = null;
            }
            // Esconde todos os canvases
            canvasCtl.showOnlyCanvas(null);
        },
        showGame: (gameType) => {
            gamesCtl.stopGame();
            buttonsCtl.resetButtonStyles();
            // Mostra apenas o canvas do jogo selecionado
            canvasCtl.showOnlyCanvas(gameType);
            gamesMap[gameType]?.();
            buttonsCtl.highlightSelectedButton(gameType);
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
        showOnlyCanvas: (canvasId) => {
            const canvases = document.querySelectorAll('.game-canvas');
            canvases.forEach(canvas => {
                if (canvasId && canvas.id === canvasId) {
                    canvas.classList.add('active');
                } else {
                    canvas.classList.remove('active'); 
                }
            });
        },
        resizeCanvas: (canvas) => {
            if (!canvas) return;
            const aspectRatio = 4 / 3;
            let width = Math.min(window.innerWidth * 0.7, 800);
            let height = width / aspectRatio;
            if (height > window.innerHeight * 0.8) {
                height = window.innerHeight * 0.8;
                width = height * aspectRatio;
            }
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
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                gamesCtl.stopGame();
                buttonsCtl.resetButtonStyles();
            }
        });
        // Remove evento de clique fora dos jogos para não sumir o container
    };

    // Ajusta resize para todos os canvases, mesmo ocultos, ao carregar
    function resizeAllCanvases() {
        [pongCanvas, snakeCanvas, tttCanvas].forEach(canvas => {
            if (canvas) {
                canvas.style.display = 'block'; // Garante que o canvas não está hidden para calcular tamanho
                canvasCtl.resizeCanvas(canvas);
                if (!canvas.classList.contains('active')) {
                    canvas.style.display = '';
                }
            }
        });
    }
    resizeAllCanvases();
    window.addEventListener('resize', resizeAllCanvases);
    // Mostra nada por padrão
    canvasCtl.showOnlyCanvas(null);
    setEventListeners();
});

