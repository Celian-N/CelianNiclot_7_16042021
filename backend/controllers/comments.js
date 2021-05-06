const Comment = require('../models/comments.js');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }
  const commentRequest = JSON.parse(req.body);

  // Create a Comment
  const comment = new Comment({
    ...commentRequest,
    authorId: req.userId,
    userLiked: JSON.stringify([]),
    creationDate: new Date(),
  });

  // Save Comment in the database
  Comment.create(comment, (err, comment) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while creating the comment.',
      });
    return res.status(201).json(comment);
  });
};

// Retrieve all Comments from the database.
exports.findAll = (req, res) => {
  Comment.getAll((err, comments) => {
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
  Comment.findById(
    req.params.commentId,
    req.userId,
    (err, comment) => {
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
            message:
              'Error retrieving Comment with id ' +
              req.params.commentId,
          });
        }
      } else res.status(200).json(comment);
    }
  );
};

// Update a Comment identified by the commentId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

  const commentRequest = JSON.parse(req.body) ;

  Comment.updateById(
    req.params.commentId,
    req.userId,
    { ...commentRequest },
    (err, comment) => {
      if (err) {
        if (err.kind === 'not_found') {
          return res.status(404).json({
            message: `Not found Comment with id ${req.params.commentId}.`,
          });
        } else {
          return res.status(500).json({
            message:
              'Error updating Comment with id ' + req.params.commentId,
          });
        }
      }
      return res.status(200).json(comment);
    }
  );
};

// Delete a Comment with the specified commentId in the request
exports.delete = (req, res) => {
  Comment.remove(req.params.commentId, (err, comment) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          message: `Not found Comment with id ${req.params.commentId}.`
        });
      } else {
        res.status(500).json({
          message: "Could not delete Comment with id " + req.params.commentId
        });
      }
    } else res.status(200).json({ message: `Comment was deleted successfully!` });
  });
};
