const sql = require('./db.js');

const User = function (user) {
  this.email = user.email;
  this.firstname = user.firstname;
  this.lastname = user.lastname;
  this.password = user.password;
  this.job = user.job;
  this.creation_date = user.creationDate;
  this.active = user.active;
  this.user_pic = user.userPic;
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
      active: newUser.active,
      userPic: newUser.user_pic,
    });
  });
};

User.findById = (userId, result) => {
  sql.query(
    `SELECT id, email, firstname, lastname, job, creation_date as creationDate , user_pic as userPic, admin_role as adminRole FROM Users WHERE id = ${userId}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.length) {
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
    } else if (res.length && res[0].active == 0) {
      return result({ kind: 'banish' }, null);
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found User with the email
    result({ kind: 'not_found' }, null);
  });
};

User.getAll = (search, result) => {
  sql.query(
    `SELECT id, email, firstname, lastname, job, creation_date as creationDate, user_pic as userPic FROM Users WHERE firstname LIKE "${search}%" OR lastname LIKE "${search}%"`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      result(null, res);
    }
  );
};

User.updateById = (userId, user, result) => {
  const sqlQuery = `UPDATE Users SET email = ?, firstname = ?, lastname = ?, job = ?${
    user.userPic || user.userPic === null ? ', user_pic = ?' : ''
  }${user.password ? ', password = ?' : ''}  WHERE id = ?`;
  const requestValues = [user.email, user.firstname, user.lastname, user.job];
  if (user.userPic) {
    requestValues.push(user.userPic);
  }
  if (user.password) {
    requestValues.push(user.password);
  }
  requestValues.push(parseInt(userId));

  sql.query(sqlQuery, requestValues, (err, res) => {
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

    console.log('updated user: ', { id: userId, ...user });
    result(null, { id: userId, ...user });
  });
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
