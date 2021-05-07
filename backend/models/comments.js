const sql = require('./db.js');

const Comment = function (comment) {
  this.author_id = comment.authorId;
  this.publication_id = comment.publicationId;
  this.user_liked = comment.userLiked;
  this.text = comment.text;
  this.creation_date = comment.creationDate;
};

Comment.create = (newComment, result) => {
  sql.query('INSERT INTO Comments SET ?', newComment, (err, res) => {
    if (err) {
      console.log('error :', err);
      result(err, null);
      return;
    }

    console.log('created comment: ', {
      id: res.insertId,
      ...newComment,
    });
    result(null, {
      id: res.insertId,
      text: newComment.text,
      authorId: newComment.author_id,
      publicationId: newComment.publication_id,
      creationDate: newComment.creation_date,
      userLiked: newComment.user_liked,
    });
  });
};

Comment.findById = (commentId, userId, result) => {
  sql.query(
    'SELECT author_id as authorId, publication_id as publicationId user_liked as userLiked, text, creation_date as creationDate FROM Comments WHERE id = ?',
    commentId,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.length) {
        if (res[0].authorId !== userId) {
          result({ kind: 'unauthorized' }, null);
          return;
        }
        result(null, res[0]);
        return;
      }

      // not found User with the id
      result({ kind: 'not_found' }, null);
    }
  );
};

Comment.getAll = (publicationId, selectedPage, result) => {
  const limit = 5;
  // calculate offset
  const offset = ((selectedPage - 1) * limit) +1;

  const sqlQuery = `SELECT id, author_id as authorId, publication_id as publicationId, user_liked as userLiked, text, creation_date as creationDate FROM Comments WHERE publication_id = ? ORDER BY creationDate DESC LIMIT ${
    selectedPage ? `${offset}, ${limit}` : '1'
  }`;

  sql.query(sqlQuery, publicationId, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('comments: ', res);
    result(null, res);
  });
};

Comment.updateById = (commentId, userId, newCommentText, result) => {
  sql.query(
    'UPDATE Comments SET text = ? WHERE id = ? AND author_id = ?',
    [newCommentText, commentId, userId],
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

      console.log('updated comment: ', {
        id: commentId,
        text : newCommentText
      });
      result(null, { id: commentId,  text : newCommentText });
    }
  );
};

Comment.remove = (commentId, userId, result) => {
  sql.query(
    'DELETE FROM Comments WHERE id = ? AND author_id = ?',
    [commentId, userId],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        console.log('res :', res);
        // not found Customer with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('deleted comment with id: ', commentId);
      result(null, res);
    }
  );
};

module.exports = Comment;
