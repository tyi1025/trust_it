const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { Image } = require('../models');
const upload = require('../models/upload');
const Grid = require('gridfs-stream');
const router = express.Router();
require('dotenv').config();

const { MONGO_URI } = process.env;
let gfs;

const conn = mongoose.createConnection(MONGO_URI);
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('photos');
});

router.post('/upload', upload.single('file'), async (req, res) => {
  if (req.file === undefined) return res.send('you must select a file.');
  return res.send({image_id: req.file.id});
});

router.get('/fetch/:fileId', async (req, res) => {
  try {
    const bucket =
      new mongoose.mongo.GridFSBucket(conn.db, {bucketName : 'photos'});
    bucket.openDownloadStream(ObjectId(req.params.fileId))
      .on('error', e => {throw e;})
      .pipe(res);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

router.delete('/delete/:filename', async (req, res) => {
  try {
    await gfs.files.deleteOne({ filename: req.params.filename });
    res.send('success');
  } catch (error) {
    res.status(400);
    res.send('An error occured.');
  }
});

router.get('/products/fetch/:imageId', async (req, res) => {
  const imageId = req.params.imageId;

  if(typeof imageId === 'undefined') {
    res.status(400);
    res.send({'message': ':imageId is required'});
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    res.status(400);
    res.send({'message': `Id (${imageId}) is not valid`});
    return;
  }

  try {
    const image = await Image.findById(imageId).exec();
    if (image === null) {
      res.status(400);
      res.send({ 'message': `Product with Id (${imageId}} not found` });
    }
    res.send(image);
  } catch (e) {
    res.status(400);
    res.send({'message': 'And unknown error occurred'});
  }
});


module.exports = router;
