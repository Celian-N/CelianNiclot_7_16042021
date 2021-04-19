const sql = require('./db.js');

const User = function (user) {
  this.email = user.email;
  this.firstname = user.firstname;
  this.lastname = user.lastname;
  this.password = user.password;
  this.job = user.job;
  this.creation_date = user.creationDate;
  this.email = user.email;
  this.active = user.active;
};

User.create = (newUser, result) => {
  sql.query('INSERT INTO Users SET ?', newUser, (err, res) => {
    if (err) {
      console.log('error :', err);
      result(err, null);
      return;
    }

    console.log('created user: ', { id: res.insertId, ...newUser });
    result(null, {
      id: res.insertId,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      job: newUser.job,
      creationDate: newUser.creation_date,
      email: newUser.email,
      active: newUser.active,
    });
  });
};

User.findById = (userId, result) => {
  sql.query(
    `SELECT email, firstname, lastname, job, creation_date as creationDate FROM Users WHERE id = ${userId}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log('found user: ', res[0]);
        result(null, res[0]);
        return;
      }

      // not found User with the id
      result({ kind: 'not_found' }, null);
    }
  );
};

User.findByEmail = (userEmail, result) => {
  sql.query(`SELECT * FROM Users WHERE email = ?`, userEmail, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found user: ', res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the email
    result({ kind: 'not_found' }, null);
  });
};

User.getAll = (result) => {
  sql.query('SELECT email, firstname, lastname, job, creation_date as creationDate FROM Users', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('users: ', res);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    'UPDATE USERS SET email = ?, firstname = ?, lastname = ?, job = ?, active = ? WHERE id = ?',
    [user.email, user.name, user.active, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('updated user: ', { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query('DELETE FROM Users WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('deleted user with id: ', id);
    result(null, res);
  });
};

module.exports = User;
