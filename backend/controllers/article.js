const Meta = require('html-metadata-parser');

exports.getMetadata = (req, res) => {
  const articleLink = req.query.article.toString();

  if (!articleLink) {
    return res.status(400).json({ message: 'Content can not be empty!' });
  }
  Meta.parser(articleLink, function (err, result) {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json({ articleData: result });
  });
};
