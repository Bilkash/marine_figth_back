const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
        origin:'http://localhost:3000',
    }
});
const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}

const initialGameState = [
    ['water', 'water', 'water'],
    ['water', 'ship', 'water'],
    ['water', 'water', 'water']
];

let gameState = initialGameState;

app.use(cors(corsOptions));

// Обработчик подключения клиента
io.on('connection', socket => {
    console.log('Клиент подключился');

    // Отправка состояния игры клиенту
    socket.emit('gameState', gameState);
    // Обработчик хода игрока
    socket.on('makeMove', ({ row, col }) => {
        // Обработка хода и обновление состояния игры
        // Ваш код здесь

        // Отправка обновленного состояния игры всем клиентам
        io.emit('gameState', gameState);
    });

    // Обработчик отключения клиента
    socket.on('disconnect', () => {
        console.log('Клиент отключился');
    });
});

// Роут для получения состояния игры
app.get('/api/game-state', (req, res) => {
    console.log("GET GAME STATE")
    res.json(gameState);
});

// Роут для обработки хода игрока
app.post('/api/make-move', (req, res) => {
    const { row, col } = req.body;

    // Обработка хода и обновление состояния игры
    // Ваш код здесь

    // Отправка обновленного состояния игры клиенту
    io.emit('gameState', gameState);

    res.json(gameState);
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
