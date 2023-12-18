const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const expressPort = process.env.PORT || 3000;
// const socketIoPort = 3001;

const io = socketIo(server);

// global vars
let numClients = 0;
let gameInterval = 0;
let roundState = false;
// let gameState = false;

// board :
const canvas = {
    height: 420,
    width: 560,
}

// objects : paddles and ball
const ball = {
	x: 0,
	y: 0,
	vX: 0,
	vY: 0,
	r: 8,
	sp: 4,
	color: "#FFFFFF"
};

const paddle1 = {
	x: 0,
	y: 0,
	vX: 0,
	vY: 0,
	width: 15,
	height: 70,
	sp: 0,
	color: "#0000FF"
}

const paddle2 = {
	x: 0,
	y: 0,
	vX: 0,
	vY: 0,
	width: 15,
	height: 70,
	sp: 0,
	color: "#FF0000"
}

paddle1.x = paddle1.width;
paddle1.y = (canvas.height - paddle1.height) / 2;

paddle2.x = canvas.width - (paddle2.width * 2);
paddle2.y = (canvas.height - paddle2.height) / 2;

// paddle1.x = paddle1.width;
// paddle1.y = 210 - paddle1.height / 2;

// paddle2.x = 560 - paddle2.width * 2;
// paddle2.y = 210 - paddle2.height / 2;

// players + score
const score = {
	color: "#FFFFFF",
	fontsize: 50,
	font: "",
}
score.font = `${score.fontsize}px \'Lilita One\', sans-serif`;

const player1 = {
	id: 0,
    clientId: 0,
	login: "Player 1",
	paddle: paddle1,
	score: 0,
    gameState: false,
}

const player2 = {
	id: 0,
    clientId: 0,
	login: "Player 2",
	paddle: paddle2,
	score: 0,
    gameState: false,
}

const data = {
    ball: ball,
    player1: player1,
    player2: player2,
    paddle1: paddle1,
    paddle2: paddle2,
}

// Set up Socket.IO event handlers
io.on('connection', (client) => {
    numClients = io.engine.clientsCount;
    if (numClients < 2)
        player1.clientId = client.id;
    else if (numClients == 2)
        player2.clientId = client.id;

    client.emit('clientId', client.id, numClients);
    // client.emit('pong');
    console.log(`Client connected with ID: ${client.id}`);
    console.log(`Number of connected clients: ${numClients}`);

    // Handle other events or messages from the client
    client.on('ping', () => {
        console.log("ping received ! emitting pong...");
        client.emit('pong');
    });

    // player controls
    client.on('clickedCanvas', () => {
        console.log(`clicked canvas ! (from client ${client.id})`);
    });

    client.on('moveUp', () => {
        if (client.id == player1.clientId) {
            // console.log(`player 1 moving up !`);
            if (player1.gameState == false && player2.gameState)
                return (player1.gameState = true, startRound());
            player1.gameState = true;
            paddle1.sp = -2;
        }
        else if (client.id == player2.clientId) {
            // console.log(`player 2 moving up !`);
            if (player2.gameState == false && player1.gameState)
                return (player2.gameState = true, startRound());
            player2.gameState = true;
            paddle2.sp = -2;
        }
    });

    client.on('moveDown', () => {
        if (client.id == player1.clientId) {
            // console.log(`player 1 moving down !`);
            if (player1.gameState == false && player2.gameState)
                return (player1.gameState = true, startRound());
            player1.gameState = true;
            paddle1.sp = 2;
        }
        else if (client.id == player2.clientId) {
            // console.log(`player 2 moving down !`);
            if (player2.gameState == false && player1.gameState)
                return (player2.gameState = true, startRound());
            player1.gameState = true;
            paddle1.sp = 2;
        }
    });

    client.on('stop', () => {
        if (client.id == player1.clientId) {
            // console.log(`player 1 stopping !`);
            paddle1.sp = 0;
        }
        else if (client.id == player2.clientId) {
            // console.log(`player 2 stopping !`);
            paddle2.sp = 0;
        }
    });

    // init board
    function initBoard() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height/ 2;
        ball.vX = 0;
        ball.vY = 0;
        ball.sp = 0;
        // paddle1.x = paddle1.width;
        // paddle1.y = 210 - paddle1.height / 2;
        paddle1.vX = 0;
        paddle1.vY = 0;
        paddle1.sp = 0;
        // paddle2.x = 560 - paddle2.width * 2;
        // paddle2.y = 210 - paddle2.height / 2;
        paddle2.vX = 0;
        paddle2.vY = 0;
        paddle2.sp = 0;
        paddle1.x = paddle1.width;
        paddle1.y = (canvas.height - paddle1.height) / 2;

        paddle2.x = canvas.width - (paddle2.width * 2);
        paddle2.y = (canvas.height - paddle2.height) / 2;
    }

    // vector calculations for ball dir
    function normalizeBallDir() {
        let l = Math.sqrt(ball.vX * ball.vX + ball.vY * ball.vY);
        ball.vX /= l;
        ball.vY /= l;
        ball.vX *= ball.sp;
        ball.vY *= ball.sp;
    }

    function getRandomDir() {
        let signX = Math.random();
        let signY = Math.random();
        ball.vX = (Math.random()) * ((signX >= 0.5) ? 1 : -1);
        ball.vY = (Math.random()) * ((signY >= 0.5) ? 1 : -1);
        normalizeBallDir();
    }

    // collisions calculations
    function calculateBallDir(paddleNbr) {
        let contactX = paddle1.x + paddle1.width;
        let contactY = ball.y;
        let paddleCenterX = paddle1.x - paddle1.width;
        let paddleCenterY = paddle1.y + paddle1.height / 2;

        if (paddleNbr == 2) {
            contactX = paddle2.x;
            contactY = ball.y;
            paddleCenterX = paddle2.x + paddle2.width * 2;
            paddleCenterY = paddle2.y + paddle2.height / 2;
        }

        ball.vX = contactX - paddleCenterX;
        ball.vY = contactY - paddleCenterY;
        normalizeBallDir();
    }

    function ballHitsWall() {
        if ((ball.y + ball.r >= canvas.height && ball.y < canvas.height) || (ball.y - ball.r <= 0 && ball.y > 0))
            ball.vY *= -1;
    }

    function ballHitsPaddle1() {
        if (ball.y >= paddle1.y && ball.y <= paddle1.y + paddle1.height) {
            if (ball.x > paddle1.x + paddle1.width && ball.x - ball.r <= paddle1.x + paddle1.width) {
                ball.sp *= 1.1;
                // paddle1.sp *= 1.1;
                calculateBallDir(1);
            }
        }
    }

    function ballHitsPaddle2() {
        if (ball.y >= paddle2.y && ball.y <= paddle2.y + paddle2.height) {
            if (ball.x < paddle2.x && ball.x + ball.r >= paddle2.x) {
                // ball.vX *= -1;
                ball.sp *= 1.1;
                // paddle2.sp *= 1.1;
                calculateBallDir(2);
            }
        }
    }

    // ball out of bounds
    function ballIsOut() {
        if (ball.x >= canvas.width)
            return (player1.score++, true);
        if (ball.x <= 0)
            return (player2.score++, true);
        return false;
    }

    // updating objects
    function updateBall() {
        if (ballIsOut())
            return true;
        ballHitsWall();
        ballHitsPaddle1();
        ballHitsPaddle2();
        ball.x += ball.vX;
        ball.y += ball.vY;
        return false;
    }
    // update objects
    function updatePaddle(paddle) {
        // if (paddle.y < 0 && paddle.vY < 0)
        //     paddle.vY = 0;
        // if (paddle.y + paddle.height > canvas.height && paddle.vY > 0)
        //     paddle.vY = 0;
        // paddle.x += paddle.vX;
        paddle.y += paddle.sp;
    }

    function updateData() {
        if (updateBall())
            return (endRound);
        // updateBall();
        updatePaddle(data.paddle1);
        updatePaddle(data.paddle2);
        data.ball = ball;
        data.player1 = player1;
        data.player2 = player2;
        data.paddle1 = paddle1;
        data.paddle2 = paddle2;
    }

    // game loop
    // starting the round
    function startRound() {
        console.log("starting the round !!!!!!!!");
        initBoard;
        ball.sp = 4;
        paddle1.sp = 4;
        paddle2.sp = 4;
        getRandomDir();
        console.log(ball.vY);
        gameInterval = setInterval(calculateFrame, 10);
    }

    // ending the game + restart screen
    function endGame() {
        console.log("Game Over!");
        console.log(`Player 1 Score: ${player1.score}`);
        console.log(`Player 2 Score: ${player2.score}`);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // displayEndScreen();
        initBoard();
        player1.score = 0;
        player2.score = 0;
        player1.gameState = false;
        player2.gameState = false;
    }

    // ending the round, resetting board
    function endRound() {
        console.log("ending round...");
        // player1.gameState = false;
        // player2.gameState = false;
        clearInterval(gameInterval);
        if (player1.score == 10 || player2.score == 10)
            return (endGame());
        initBoard();
        calculateFrame();
    }

    function calculateFrame() {
        // console.log(`player 1 game state : ${player1.gameState}`);
        updateData();
        console.log("calculating frame...");
        client.emit('render', data);
    }

    // gameInterval = setInterval(calculateFrame, 10);

    // disconnect event
    client.on('disconnect', () => {
        numClients = io.engine.clientsCount;
        console.log(`Client disconnected with ID: ${client.id} (num clients: ${numClients})`);
    });
});

app.use(express.static('./public/remote/'));

// Start the server
server.listen(expressPort, () => {
    console.log(`Express server running on port ${expressPort}`);
});
