const Meta = require('html-metadata-parser');

const {
  getSignaledPublications,
  getSignaledComments,
  deleteComment,
  ignoreComment,
  deletePublication,
  ignorePublication,
  banishUser,
  unbanishUser,
  getUserRole,
} = require('../models/admin.js');

exports.isUserAdmin = (req, res, next) => {
  return getUserRole(req.userId, (err, role) => {
    if (err) {
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while checking admin rights.',
      });
    } else {
      if (role.adminRole == 0) {
        return res.status(403).json({
          message: 'You are not admin.',
        });
      } else {
        next();
      }
    }
  });
};
// Retrieve all signaled Publications from the database.
exports.getAllSignaled = (req, res) => {
  getSignaledPublications(async (err, signaledPublications) => {
    if (err) {
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while retrieving publications.',
      });
    } else {
      const returnedPublications = await Promise.all(
        signaledPublications.map(async (publication) => {
          if (publication.link) {
            const linkData = await Meta.parser(
              publication.link,
              function (err, result) {
                if (err) return null;
                return result;
              }
            );
            return {
              ...publication,
              link: linkData,
              userLiked: JSON.parse(publication.userLiked),
            };
          }

          return {
            ...publication,
            userLiked: JSON.parse(publication.userLiked),
          };
        })
      );
      getSignaledComments((err, signaledComments) => {
        if (err)
          return res.status(500).json({
            message:
              err.message || 'Some error occurred while retrieving comments.',
          });

        console.log('returned signaledPost :', [
          ...returnedPublications,
          ...signaledComments,
        ]);

        res.status(200).json([...returnedPublications, ...signaledComments]);
      });
    }
  });
};

exports.removeComment = (req, res) => {
  const commentId = parseInt(req.params.commentId);

  deleteComment(commentId, (err, comment) => {
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
      res.status(200).json({
        id: req.params.commentId,
        message: `Comment was deleted successfully!`,
      });
  });
};

exports.removePublication = (req, res) => {
  const publicationId = parseInt(req.params.publicationId);

  deletePublication(publicationId, (err, publication) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found Publication with id ${req.params.publicationId}.`,
        });
      } else {
        res.status(500).json({
          message:
            'Could not delete Publication with id ' + req.params.publicationId,
        });
      }
    } else {
      res.status(200).json({
        message: `Publication was deleted successfully!`,
        id: req.params.publicationId,
      });
    }
  });
};

exports.ignoreComment = (req, res) => {
  const commentId = parseInt(req.params.commentId);

  ignoreComment(commentId, (err, comment) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found Comment with id ${req.params.commentId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Could not ignore Comment with id ' + req.params.commentId,
        });
      }
    } else {
      res.status(200).json({
        message: `Publication was ignored successfully!`,
        id: req.params.commentId,
      });
    }
  });
};

exports.ignorePublication = (req, res) => {
  const publicationId = parseInt(req.params.publicationId);

  ignorePublication(publicationId, (err, publication) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found Publication with id ${req.params.publicationId}.`,
        });
      } else {
        res.status(500).json({
          message:
            'Could not delete Publication with id ' + req.params.publicationId,
        });
      }
    } else {
      res.status(200).json({
        message: `Publication was deleted successfully!`,
        id: req.params.publicationId,
      });
    }
  });
};

exports.banUser = (req, res) => {
  const userId = parseInt(req.params.userId);

  banishUser(userId, (err, user) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found User with id ${req.params.userId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Could not delete User with id ' + req.params.userId,
        });
      }
    } else {
      res.status(200).json({
        message: `User has been banished successfully!`,
        id: req.params.userId,
      });
    }
  });
};

exports.debanUser = (req, res) => {
  const userId = parseInt(req.params.userId);

  unbanishUser(userId, (err, user) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found User with id ${req.params.userId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Could not delete User with id ' + req.params.userId,
        });
      }
    } else {
      res.status(200).json({
        message: `User has been unbanished successfully!`,
        id: req.params.userId,
      });
    }
  });
};
