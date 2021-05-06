module.exports = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const fileSize = req.file.size;
    if(fileSize > 4*1024*1024){
      throw 'Fichier trop volumineux !';
    }
    else {
      return next();
    }
  } catch (error) {
    res.status(500).json({ error: error | 'Fichier trop volumineux !' });
  }
};
