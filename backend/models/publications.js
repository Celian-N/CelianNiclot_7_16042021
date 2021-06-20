const sql = require('./db.js');

const Publication = function (publication) {
  this.author_id = publication.authorId;
  this.user_liked = publication.userLiked;
  this.image_url = publication.imageUrl;
  this.gif_url = publication.gifUrl;
  this.video_url = publication.videoUrl;
  this.text = publication.text;
  this.link = publication.link;
  this.creation_date = publication.creationDate;
  this.signaled = publication.signaled
};

Publication.create = (newPublication, result) => {
  sql.query('INSERT INTO Publications SET ?', newPublication, (err, res) => {
    if (err) {
      console.log('error :', err);
      result(err, null);
      return;
    }

    console.log('created publication: ', {
      id: res.insertId,
      ...newPublication,
    });
    result(null, {
      id: res.insertId,
      text : newPublication.text,
      link: newPublication.link,
      authorId: newPublication.author_id,
      imageUrl: newPublication.image_url,
      gifUrl: newPublication.gif_url,
      videoUrl: newPublication.video_url,
      creationDate: newPublication.creation_date,
      userLiked: JSON.parse(newPublication.user_liked),
      signaled : newPublication.signaled
    });
  });
};

Publication.findById = (publicationId, userId, result) => {
  sql.query(
    'SELECT author_id as authorId, user_liked as userLiked, image_url as imageUrl, gif_url as gifUrl, video_url as videoUrl, text, link, creation_date as creationDate FROM Publications WHERE id = ?',
    publicationId,
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

Publication.getAll = (selectedPage, result) => {

  const limit = 5
  // calculate offset
  const offset = (selectedPage - 1) * limit
  
  sql.query(
    `SELECT id, author_id as authorId, user_liked as userLiked, image_url as imageUrl, gif_url as gifUrl, video_url as videoUrl, text, link, creation_date as creationDate FROM Publications ORDER BY creationDate DESC LIMIT ${offset}, ${limit}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Publication.getMostLiked = (result) => {
  
  sql.query(
    `SELECT id, author_id as authorId, user_liked as userLiked, image_url as imageUrl, gif_url as gifUrl, video_url as videoUrl, text, link, creation_date as creationDate FROM Publications ORDER BY CHAR_LENGTH(userLiked) DESC LIMIT 5`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Publication.getPostByUserId = (userId, result) => {

  sql.query(
    `SELECT id, author_id as authorId, user_liked as userLiked, image_url as imageUrl, gif_url as gifUrl, video_url as videoUrl, text, link, creation_date as creationDate FROM Publications WHERE author_id = ? ORDER BY creationDate ASC`, userId,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Publication.updateById = (publicationId, userId, publication, result) => {
  const sqlOptions = `${
    publication.imageUrl || publication.imageUrl === null
      ? 'image_url = ?,'
      : ''
  }${publication.gifUrl || publication.gifUrl === null ? 'gif_url = ?,' : ''}${
    publication.videoUrl || publication.videoUrl === null
      ? 'video_url = ?,'
      : ''
  }${publication.text || publication.text === null ? 'text = ?,' : ''}${
    publication.link || publication.link === null ? 'link = ?,' : ''
  }`;

  const splitOptions = sqlOptions.split(',');
  splitOptions.pop();
  const fullOptions = splitOptions.join();

  const sqlQuery = `UPDATE Publications SET ${fullOptions} WHERE id = ? AND author_id = ?`;

  const requestValues = [];
  Object.values(publication).forEach((element) => requestValues.push(element));
  requestValues.push(parseInt(publicationId));
  requestValues.push(userId);

  sql.query(sqlQuery, requestValues, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    console.log('updated publication: ', {
      id: publicationId,
      ...publication,
    });
    result(null, { id: publicationId, ...publication });
  });
};

Publication.remove = (publicationId, userId, result) => {
  sql.query(
    'DELETE FROM Publications WHERE id = ? AND author_id = ?',
    [publicationId, userId],
    (err, res) => {
      if (err) {
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

Publication.handleLike = (publicationId, publicationLikes, result) => {
  sql.query(
    `UPDATE Publications SET user_liked = ? WHERE id = ?`,
    [publicationLikes, publicationId],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        console.log('res :', res);
        // not found Customer with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Liked publication with id: ', publicationId);
      result(null, publicationLikes);
    }
  );
};

Publication.signal = (publicationId, result) => {
  sql.query(
    `UPDATE Publications SET signaled = ? WHERE id = ?`,
    [1, publicationId],
    (err, res) => {
      if (err) {

        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }

      console.log('Publication with id signaled: ', publicationId);
      result(null, publicationId);
    }
  );
};

module.exports = Publication;
