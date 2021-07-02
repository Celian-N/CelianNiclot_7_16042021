const fs = require('fs');
const Meta = require('html-metadata-parser');

const Publication = require('../models/publications.js');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }
  const publicationRequest = JSON.parse(req.body.publication);

  // Create a Publication
  const publication = new Publication({
    ...publicationRequest,
    authorId: req.userId,
    userLiked: JSON.stringify([]),
    imageUrl: req.file
      ? `${req.protocol}://${req.get('host')}/${req.imagePath}/${
          req.file.filename
        }`
      : null,
    creationDate: new Date(),
    signaled: 0,
  });

  // Save Publication in the database
  Publication.create(publication, async (err, publication) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while creating the publication.',
      });

    if (publication.link) {
      const linkData = await Meta.parser(
        publication.link,
        function (err, result) {
          return result;
        }
      );
      return res.status(201).json({
        ...publication,
        link: linkData,
      });
    }
    return res.status(201).json({ ...publication });
  });
};

// Retrieve all Publications from the database.
exports.findAll = (req, res) => {
  const selectedPage = req.query.page;
  Publication.getAll(selectedPage, async (err, publications) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while retrieving publications.',
      });

    const returnedPublications = await Promise.all(
      publications.map(async (publication) => {
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

    res.status(200).json(returnedPublications);
  });
};
// Retrieve all Publications from the database.
exports.findMostLiked = (req, res) => {
  Publication.getMostLiked((err, publications) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while retrieving publications.',
      });

    const returnedPublications = publications.map((publication) => {
      return {
        ...publication,
        userLiked: JSON.parse(publication.userLiked),
      };
    });

    res.status(200).json(returnedPublications);
  });
};

exports.findPostByUserId = (req, res) => {
  const userId = parseInt(req.params.userId);

  Publication.getPostByUserId(userId, async (err, publications) => {
    if (err)
      return res.status(500).json({
        message:
          err.message ||
          'Some error occurred while retrieving your publications.',
      });

    const returnedPublications = await Promise.all(
      publications.map(async (publication) => {
        if (publication.link) {
          return await Meta.parser(publication.link)
            .then((result) => {
              return {
                ...publication,
                link: result,
                userLiked: JSON.parse(publication.userLiked),
              };
            })
            .catch((error) => {
              return null;
            });
        }

        return {
          ...publication,
          userLiked: JSON.parse(publication.userLiked),
        };
      })
    );

    res.status(200).json(returnedPublications);
  });
};

// Find a single Publication with a publicationId
exports.findOne = (req, res) => {
  Publication.findById(
    req.params.publicationId,
    req.userId,
    async (err, publication) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).json({
            message: `Not found Publication with id ${req.params.publicationId}.`,
          });
        } else if (err.kind === 'unauthorized') {
          res.status(401).json({
            message: 'You are unauthorized to edit this post',
          });
        } else {
          res.status(500).json({
            message:
              'Error retrieving Publication with id ' +
              req.params.publicationId,
          });
        }
      } else {
        if (publication.link) {
          const linkData = await Meta.parser(
            publication.link,
            function (err, result) {
              return result;
            }
          );
          return res.status(200).json({
            ...publication,
            link: linkData,
          });
        }
        return res.status(200).json({ ...publication });
      }
    }
  );
};

// Update a Publication identified by the publicationId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

  const publicationRequest = req.file
    ? {
        ...JSON.parse(req.body.publication),
        imageUrl: `${req.protocol}://${req.get('host')}/${req.imagePath}/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.publication) };

  Publication.updateById(
    req.params.publicationId,
    req.userId,
    { ...publicationRequest },
    async (err, publication) => {
      if (err) {
        if (err.kind === 'not_found') {
          return res.status(404).json({
            message: `Not found Publication with id ${req.params.publicationId}.`,
          });
        } else {
          return res.status(500).json({
            message:
              'Error updating Publication with id ' + req.params.publicationId,
          });
        }
      }
      if (publication.link) {
        const linkData = await Meta.parser(
          publication.link,
          function (err, result) {
            return result;
          }
        );
        return res.status(200).json({
          ...publication,
          link: linkData,
        });
      }
      return res.status(200).json({ ...publication });
    }
  );
};

// Delete a Publication with the specified publicationId in the request
exports.delete = (req, res) => {
  Publication.findById(
    req.params.publicationId,
    req.userId,
    (err, publication) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).json({
            message: `Not found Publication with id ${req.params.publicationId}.`,
          });
        } else if (err.kind === 'unauthorized') {
          res.status(401).json({
            message: 'You are unauthorized to edit this post',
          });
        } else {
          res.status(500).json({
            message:
              'Error retrieving Publication with id ' +
              req.params.publicationId,
          });
        }
      } else {
        Publication.remove(
          req.params.publicationId,
          req.userId,
          (error, data) => {
            if (error) {
              if (error.kind === 'not_found') {
                res.status(404).json({
                  message: `Not found Publication with id ${req.params.publicationId}.`,
                });
              } else {
                res.status(500).json({
                  message:
                    'Could not delete Publication with id ' +
                    req.params.publicationId,
                });
              }
            } else {
              if (publication.imageUrl) {
                const filename = publication.imageUrl.split('/images/')[1];

                fs.unlink(`images/${filename}`, () => {
                  console.log('FICHIER SUPPRIMÉ');
                });
              }
              res.status(200).json({
                message: `Publication was deleted successfully!`,
                id: req.params.publicationId,
              });
            }
          }
        );
      }
    }
  );
};

// Like a Publication identified by the publicationId in the request
exports.like = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }
  Publication.findById(
    req.params.publicationId,
    req.userId,
    true,
    (err, publication) => {
      if (err) {
        if (err.kind === 'not_found') {

          res.status(404).json({
            message: `Not found Publication with id ${req.params.publicationId}.`,
          });
        } else {
          res.status(500).json({
            message:
              'Error retrieving Publication with id ' +
              req.params.publicationId,
          });
        }
      } else {
        const publicationLikes = JSON.parse(publication.userLiked);
        const userIndex = publicationLikes.indexOf(req.body.userId);

        if (userIndex >= 0) {
          publicationLikes.splice(userIndex, 1);
        } else {
          publicationLikes.push(req.body.userId);
        }
        Publication.handleLike(
          req.params.publicationId,
          JSON.stringify(publicationLikes),
          (err, likes) => {
            if (err) {
              if (err.kind === 'not_found') {
                res.status(404).json({
                  message: `An error occured when liking publication with id ${req.params.publicationId}.`,
                });
              } else {
                res.status(500).json({
                  message:
                    'Error retrieving Publication with id ' +
                    req.params.publicationId,
                });
              }
            } else {
              res.status(200).json({
                message: `Publication liked successfully!`,
                publicationLikes: JSON.parse(likes),
              });
            }
          }
        );
      }
    }
  );
};

// Signal publication
exports.signal = (req, res) => {
  const publicationId = req.params.publicationId;
  Publication.signal(publicationId, (err, publicationId) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while signaling publication.',
      });

    res.status(200).json(publicationId);
  });
};
