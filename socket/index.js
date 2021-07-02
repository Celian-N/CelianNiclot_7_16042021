const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origins: '*:*',
  },
});

const DataBase = require('./database.js');

const db = new DataBase();

io.use(async (socket, next) => {
  if (!socket.handshake.auth.sessionId) {
    socket.userId = socket.handshake.auth.userId;
    return next();
  }
  const sessionId = socket.handshake.auth.sessionId;
  const userId1 = socket.handshake.auth.sessionId.split('-')[0];
  const userId2 = socket.handshake.auth.sessionId.split('-')[1];
  const inverseSessionId = [userId2, userId1].join('-');
  if (sessionId) {
    const session = await db.addSession({
      sessionId,
      inverseSessionId,
      userId1,
      userId2,
    });
    if (session) {
      socket.sessionId = session.sessionId;
      socket.userId = parseInt(userId1);
      return next();
    }
  }
});

io.on('connection', async (socket) => {
  const connectedUsers = [];
  for (let [id, socket] of io.of('/').sockets) {
    if (connectedUsers.includes(socket.userId)) return;
    connectedUsers.push(socket.userId);
  }
  console.log(connectedUsers);

  socket.broadcast.emit('user_connected', connectedUsers);

  if (socket.sessionId) {
    socket.emit('session', {
      sessionId: socket.sessionId,
      userId: socket.userId,
    });
  }

  socket.on('messages', async (sessionId) => {
    const messages = await db.fetchSessionMessages(sessionId);
    socket.emit('messages', messages);
  });

  if (socket.userId) {
    socket.join(socket.userId);
  }

  socket.on('getOldSessions', async (userId) => {
    const allSessions = await db.getOldSessions(userId);
    socket.emit('getOldSessions', allSessions);
  });

  socket.on('readMessages', async ({ userId, sessionId }) => {
    console.log('USER ID ;', userId);
    await db.readMessages(userId, sessionId);
    socket.emit('readMessages', { userId, sessionId });
  });

  socket.on('getUnreadMessages', async (userId) => {
    const result = await db.getUnreadMessages(userId);
    console.log('result : ', result);

    socket.emit('getUnreadMessages', result);
  });

  socket.on('private message', async ({ content, from, to }) => {
    console.log(content, from, to);
    socket
      .to(to)
      .to(socket.userId)
      .emit('private message', { content, from, to });
    await db.storeUserMessage({
      message: content,
      userId: from,
      sessionId: socket.sessionId,
    });
  });

  socket.on('typing', ({ typingValue, userId }) => {
    socket.broadcast.emit('typing', { typingValue, userId });
  });

  socket.on('disconnect', async () => {
    console.log('DISCONNECTED...');
    const matchingSockets = await io.in(socket.userId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      const index = connectedUsers.indexOf(socket.userId);
      connectedUsers.splice(index, 1);
      socket.broadcast.emit('user_connected', connectedUsers);

      socket.broadcast.emit('user disconnected', socket.userId);
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
