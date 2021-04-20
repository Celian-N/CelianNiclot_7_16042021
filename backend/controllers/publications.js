const Publication = require('../models/publications.js');


exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

    // Create a User
    const publication = new User({
      authorId: req.body.authorId,
      userLiked: JSON.stringify([]),
      imageUrl: req.body.imageUrl,
      videoUrl: req.body.videoUrl,
      text: req.body.text,
      link: req.body.link,
      creationDate: new Date(),
    });

    // Save User in the database
    Publication.create(publication, (err, data) => {
      if (err)
        return res.status(500).json({
          message:
            err.message || 'Some error occurred while creating the publication.',
        });
      return res.status(201).json(data);
    });
}; 

// Retrieve all Publications from the database.
exports.findAll = (req, res) => {
  Publication.getAll(req.body.pagination,(err, data) => {
    if (err)
      res.status(500).json({
        message: err.message || 'Some error occurred while retrieving publications.',
      });
    else res.status(200).json(data);
  });
};

// Find a single Publication with a publicationId
exports.findOne = (req, res) => {
  Publication.findById(req.params.publicationId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found Publication with id ${req.params.publicationId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Error retrieving Publication with id ' + req.params.publicationId,
        });
      }
    } else res.status(200).json(data);
  });
};

// Update a Publication identified by the publicationId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).json({ message: 'Content can not be empty!' });
  }

  Publication.updateById(req.params.publicationId, new Publication(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          message: `Not found Publication with id ${req.params.publicationId}.`,
        });
      } else {
        res.status(500).json({
          message: 'Error updating Publication with id ' + req.params.publicationId,
        });
      }
    } else res.status(200).json(data);
  });
};

// Delete a Publication with the specified publicationId in the request
exports.delete = (req, res) => {
  Publication.remove(req.params.publicationId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          message: `Not found Publication with id ${req.params.publicationId}.`
        });
      } else {
        res.status(500).json({
          message: "Could not delete Publication with id " + req.params.publicationId
        });
      }
    } else res.status(200).json({ message: `Publication was deleted successfully!` });
  });
};