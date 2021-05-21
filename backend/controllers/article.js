const Meta = require('html-metadata-parser');

exports.getMetadata = (req, res) => {

  const articleLink = req.query.article
  console.log('articleLink : ', articleLink)
  if (!articleLink) {
    return res.status(400).json({ message: 'Content can not be empty!' });
  }
  Meta.parser(articleLink, function (err, result) {
    if(err){
      return;
    }
    return res.status(200).json({articleData : result})
})

};