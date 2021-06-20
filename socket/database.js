const mysql = require('mysql');
let db = null;
class DB {
  constructor() {
    db = mysql.createConnection({
      host: 'localhost',
      user: 'userproject7',
      password: 'mdp-project7',
      database: 'groupomania_socket',
    });
    db.connect(function (err) {
      if (err) console.log(err);
      else console.log('Successfully connected to the database.');
    });
  }

  addSession(data) {
    return new Promise(async (resolve, reject) => {
      if (await this.isSessionExist(data.sessionId)) {
        resolve({ sessionId: data.sessionId });
      } else if (await this.isSessionExist(data.inverseSessionId)) {
        resolve({ sessionId: data.inverseSessionId });
      } else
        db.query(
          'INSERT INTO Sessions (session_id, user_id_1, user_id_2) VALUES (?,?,?)',
          [data.sessionId, data.userId1, data.userId2],
          function (err, rows) {
            if (err) reject(new Error(err));
            else resolve({ sessionId: data.sessionId });
          }
        );
    });
  }

  isSessionExist(sessionId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM Sessions WHERE session_id = ?',
        [sessionId],
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows[0]);
        }
      );
    });
  }

  fetchSessionMessages(sessionId) {
    const userId1 = sessionId.split('-')[0];
    const userId2 = sessionId.split('-')[1];
    const inverseSessionId = [userId2, userId1].join('-');

    return new Promise(async (resolve, reject) => {
      if (await this.isSessionExist(sessionId)) {
        db.query(
          'SELECT * from Messages where session_id = ?',
          [sessionId],
          function (err, rows) {
            if (err) reject(err);
            else {
              resolve(rows);
            }
          }
        );
      } else if (await this.isSessionExist(inverseSessionId)) {
        db.query(
          'SELECT * from Messages where session_id = ?',
          [inverseSessionId],
          function (err, rows) {
            if (err) reject(err);
            else {
              resolve(rows);
            }
          }
        );
      }
    });
  }

  storeUserMessage(data) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO Messages (message, user_id, session_id, is_read) VALUES (?,?,?,?)',
        [data.message, data.userId, data.sessionId, 0],
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows);
        }
      );
    });
  }

  getOldSessions(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM Sessions WHERE user_id_1 = ${userId} OR user_id_2 = ${userId}`,
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows);
        }
      );
    });
  }

  readMessages(userId, sessionId) {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE Messages SET is_read = ? WHERE user_id = ? AND session_id = ?',
        [1, userId, sessionId],
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve({ userId: userId, sessionId: sessionId });
        }
      );
    });
  }

  getUnreadMessages(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM Messages WHERE (session_id LIKE "${userId}-%" AND is_read = 0 AND user_id != ${userId}) OR (session_id LIKE "%-${userId}" AND is_read = 0 AND user_id != ${userId})`,
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = DB;
