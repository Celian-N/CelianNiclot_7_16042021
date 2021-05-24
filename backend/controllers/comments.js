const Comment = require('../models/comments.js');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

  // Create a Comment
  const newComment = new Comment({
    authorId: req.userId,
    publicationId: parseInt(req.params.publicationId),
    text: req.body.comment,
    userLiked: JSON.stringify([]),
    creationDate: new Date(),
  });

  // Save Comment in the database
  Comment.create(newComment, (err, comment) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while creating the comment.',
      });
    return res.status(201).json(comment);
  });
};

// Retrieve Comments length for publication from the database.
exports.getLengthFromPublicationId = (req, res) => {
  const publicationId = req.query.publicationId
  Comment.getLength(publicationId, (err, commentsLength) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while retrieving comments.',
      });

    res.status(200).json(commentsLength);
  });
};

// Retrieve Comments for publication from the database.
exports.findForPublication = (req, res) => {
  const publicationId = parseInt(req.params.publicationId);
  if(!publicationId) return res.status(500).json({message : 'Id de publication manquant'})
  Comment.getAll(publicationId, req.query.page, (err, comments) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while retrieving comments.',
      });

    res.status(200).json(
      comments.map((comment) => {
        return { ...comment, userLiked: JSON.parse(comment.userLiked) };
      })
    );
  });
};

// Find a single Comment with a commentId
exports.findOne = (req, res) => {
  Comment.findById(req.params.commentId, req.userId, (err, comment) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found Comment with id ${req.params.commentId}.`,
        });
      } else if (err.kind === 'unauthorized') {
        res.status(401).json({
          message: 'You are unauthorized to edit this post',
        });
      } else {
        res.status(500).json({
          message: 'Error retrieving Comment with id ' + req.params.commentId,
        });
      }
    } else res.status(200).json(comment);
  });
};

// Update a Comment identified by the commentId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

  const newCommentText = req.body.newComment;

  Comment.updateById(
    req.params.commentId,
    req.userId,
    newCommentText,
    (err, comment) => {
      if (err) {
        if (err.kind === 'not_found') {
          return res.status(404).json({
            message: `Not found Comment with id ${req.params.commentId}.`,
          });
        } else {
          return res.status(500).json({
            message: 'Error updating Comment with id ' + req.params.commentId,
          });
        }
      }
      return res.status(200).json(comment);
    }
  );
};

// Delete a Comment with the specified commentId in the request
exports.delete = (req, res) => {

  const commentId = parseInt(req.params.commentId);

  Comment.remove(commentId, req.userId, (err, comment) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found Comment with id ${req.params.commentId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Could not delete Comment with id ' + req.params.commentId,
        });
      }
    } else
      res
        .status(200)
        .json({
          id: req.params.commentId,
          message: `Comment was deleted successfully!`,
        });
  });
};


// Like a Comment identified by the commentId in the request
exports.like = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }
  console.log('BODY :', req.body);
  Comment.findById(
    req.body.commentId,
    req.userId,
    (err, comment) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).json({
            message: `Not found Comment with id ${req.body.commentId}.`,
          });
        } else {
          res.status(500).json({
            message:
              'Error retrieving Comment with id ' +
              req.body.commentId,
          });
        }
      } else {
        console.log('BODY IN LIKE :', req.body)
        const commentLikes = JSON.parse(comment.userLiked);
        const userIndex = commentLikes.indexOf(req.body.userId);
   
        if (userIndex >= 0) {
          commentLikes.splice(userIndex, 1);
        } else {
          commentLikes.push(req.body.userId);
        }
        console.log(commentLikes)
        Comment.handleLike(
          req.body.commentId,
          JSON.stringify(commentLikes),
          (err, commentLikes) => {
            if (err) {
              if (err.kind === 'not_found') {
                res.status(404).json({
                  message: `An error occured when liking comment rwith id ${req.body.commentId}.`,
                });
              } else {
                res.status(500).json({
                  message:
                    'Error retrieving Comment with id ' +
                    req.body.commentId,
                });
              }
            } else {
              res.status(200).json({
                message: `Comment liked successfully!`,
                commentLikes: JSON.parse(commentLikes),
              });
            }
          }
        );
      }
    }
  );
};

