const sql = require('./db.js');

exports.getSignaledPublications = (result) => {
  sql.query(
    `SELECT id, author_id as authorId, user_liked as userLiked, image_url as imageUrl, gif_url as gifUrl, video_url as videoUrl, text, link, creation_date as creationDate, signaled FROM Publications WHERE signaled = 1`,
    (errPublications, resPublications) => {
      if (errPublications) {
        console.log('error: ', errPublications);
        result(errPublications, null);
        return;
      }
      console.log('resPublications :', resPublications)

      result(null, resPublications)
    }
  );
 
};

exports.getSignaledComments = (result) => {
  sql.query(
    'SELECT id, author_id as authorId, publication_id as publicationId, user_liked as userLiked, text, creation_date as creationDate, signaled FROM Comments WHERE signaled = 1',
    (errComments, resComments) => {
      if (errComments) {
        console.log('error: ', errComments);
        result(errComments, null);
        return;
      }
      console.log('resComments :', resComments)
      result(null, resComments)
    }
  );

};

exports.deleteComment = (commentId, result) => {
  sql.query(
    'DELETE FROM Comments WHERE id = ?',
    [commentId],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('deleted comment with id: ', commentId);
      result(null, res);
    }
  );
};

exports.deletePublication = (publicationId, result) => {
  sql.query(
    'DELETE FROM Publications WHERE id = ?',
    [publicationId],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('deleted publication with id: ', publicationId);
      result(null, res);
    }
  );
};

exports.ignoreComment = (commentId, result) => {
  sql.query(
    `UPDATE Comments SET signaled = ? WHERE id = ?`,
    [0, commentId],
    (err, res) => {
      if (err) {

        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Comment with id ignored: ', commentId);
      result(null, commentId);
    }
  );
};

exports.ignorePublication = (publicationId, result) => {
  sql.query(
    `UPDATE Publications SET signaled = ? WHERE id = ?`,
    [0, publicationId],
    (err, res) => {
      if (err) {

        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Publication with id ignored: ', publicationId);
      result(null, publicationId);
    }
  );
};

exports.banishUser = (userId, result) => {
  sql.query(
    `UPDATE Users SET active = 0 WHERE id = ?`,
    [userId],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('deleted publication with id: ', userId);
      result(null, res);
    }
  );
};

exports.unbanishUser = (userId, result) => {
  sql.query(
    `UPDATE Users SET active = 1 WHERE id = ?`,
    [userId],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('deleted publication with id: ', userId);
      result(null, res);
    }
  );
};

exports.getUserRole = (userId, result) => {
  sql.query(
    `SELECT admin_role as adminRole from Users WHERE id = ?`,
    [userId],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }
      result(null, res[0]);
    }
  );
};


