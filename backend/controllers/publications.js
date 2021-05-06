const fs = require('fs');

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
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      : null,
    creationDate: new Date(),
  });

  // Save Publication in the database
  Publication.create(publication, (err, publication) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while creating the publication.',
      });
    return res.status(201).json(publication);
  });
};

// Retrieve all Publications from the database.
exports.findAll = (req, res) => {

  const selectedPage = req.query.page
  Publication.getAll(selectedPage, (err, publications) => {
    if (err)
      return res.status(500).json({
        message:
          err.message || 'Some error occurred while retrieving publications.',
      });

    res.status(200).json(
      publications.map((publication) => {
        return { ...publication, userLiked: JSON.parse(publication.userLiked) };
      })
    );
  });
};

// Find a single Publication with a publicationId
exports.findOne = (req, res) => {
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
      } else res.status(200).json(publication);
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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.publication) };

  Publication.updateById(
    req.params.publicationId,
    req.userId,
    { ...publicationRequest },
    (err, publication) => {
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
      return res.status(200).json(publication);
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
        console.log('errorFInd :', err)
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
          Publication.remove(req.params.publicationId, req.userId, (error, data) => {
            if (error) {
        console.log('err : ', error)

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
              if(publication.imageUrl){
                const filename = publication.imageUrl.split('/images/')[1];
        
                fs.unlink(`images/${filename}`, ()=>{console.log('FICHIER SUPPRIMÉ')})
              }
              res.status(200).json({
                message: `Publication was deleted successfully!`,
                id: req.params.publicationId,
              });
            }
              
          });
      }
    }
  );
};
