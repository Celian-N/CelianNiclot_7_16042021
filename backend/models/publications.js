const sql = require('./db.js');

const Publication = function (publication) {
  this.author_id = publication.authorId;
  this.user_liked = publication.userLiked;
  this.image_url = publication.imageUrl;
  this.video_url = publication.videoUrl;
  this.text = publication.text;
  this.link = publication.link
  this.creation_date = publication.creationDate;
};

Publication.create = (newPublication, result) => {
  sql.query('INSERT INTO Publications SET ?', newPublication, (err, res) => {
    if (err) {
      console.log('error :', err);
      result(err, null);
      return;
    }

    console.log('created publication: ', { id: res.insertId, ...newPublication });
    result(null, { id: res.insertId, ...newPublication });
  });
};

Publication.findById = (publicationId, result) => {
  sql.query(
    `SELECT author_id as authorId, user_liked as userLiked, image_url as imageUrl, video_url as videoUrl, text, link, creation_date as creationDate FROM Publications WHERE id = ${publicationId}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log('publication: ', res[0]);
        result(null, res[0]);
        return;
      }

      // not found User with the id
      result({ kind: 'not_found' }, null);
    }
  );
};

Publication.getAll = (pagination, result) => {
  sql.query(`SELECT author_id as authorId, user_liked as userLiked, image_url as imageUrl, video_url as videoUrl, text, link, creation_date as creationDate FROM Publications ORDER BY nom DESC LIMIT ${pagination.number}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('users: ', res);
    result(null, res);
  });
};

Publication.updateById = (publicationId, publication, result) => {
  sql.query(
    'UPDATE Publications SET user_liked = ?, image_url = ?, video_url = ? , text = ?, link = ? WHERE id = ?',
    [publication.userLiked, publication.imageUrl, publication.videoUrl, publication.text, publication.link, publicationId],
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

      console.log('updated publication: ', { id: publicationId, ...publication });
      result(null, { id: publicationId, ...publication });
    }
  );
};

Publication.remove = (publicationId, result) => {
  sql.query('DELETE FROM Publications WHERE id = ?', publicationId, (err, res) => {
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

    console.log('deleted publication with id: ', publicationId);
    result(null, res);
  });
};

module.exports = Publications;
