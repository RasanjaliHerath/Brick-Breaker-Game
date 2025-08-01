function startGame() {
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 900;
        canvas.height = 600;

        const paddleHeight = 10;
        const paddleWidth = 75;
        let paddleX = (canvas.width - paddleWidth) / 2;

        const ballRadius = 10;
        let x = canvas.width / 2;
        let y = canvas.height - 30;
        let dx = 4;
        let dy = -4;

        let rightPressed = false;
        let leftPressed = false;

        const brickRowCount = 5;
        const brickColumnCount = 10;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;

        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        let score = 0;
        let animationId;

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        function keyDownHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = true;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = false;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = false;
            }
        }

        function collisionDetection() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const b = bricks[c][r];
                    if (b.status === 1) {
                        if (
                            x > b.x &&
                            x < b.x + brickWidth &&
                            y > b.y &&
                            y < b.y + brickHeight
                        ) {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if (score === brickRowCount * brickColumnCount) {
                                alert("YOU WIN, CONGRATULATIONS!");
                                startGame(); // Restart without reload
                                return;
                            }
                        }
                    }
                }
            }
        }

        function drawScore() {
            ctx.font = "24px Arial";
            ctx.fillStyle = "#f1f7f4ff";
            ctx.fillText("Score: " + score, 8, 20);
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#FF0000";
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0d9e08ff";
            ctx.fill();
            ctx.closePath();
        }

        function drawBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status === 1) {
                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "#10a70bff";
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        function drawDashedLines() {
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "#2ecc71";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(10, 10);
            ctx.stroke();
            ctx.closePath();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            drawScore();
            drawDashedLines();
            collisionDetection();

            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }

            if (y + dy < ballRadius) {
                dy = -dy;
            } else if (y + dy > canvas.height - ballRadius) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                } else {
                    cancelAnimationFrame(animationId);
                    const restart = confirm("GAME OVER. Restart?");
                    if (restart) {
                        startGame(); // Restart game without page reload
                        return;
                    } else {
                        return; // Stop the game
                    }
                }
            }

            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            x += dx;
            y += dy;

            animationId = requestAnimationFrame(draw);
        }

        draw(); // Start game loop
    }

    startGame(); // Start for the first time