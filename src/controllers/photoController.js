const photos = require('../models/photo');


const addPhotoWS = (photo, callback) => {
    const maxId = Math.max(...photos.map((p) => p.id));
    const newPhoto = {
        id: maxId === -Infinity ? 1 : maxId + 1,
        title: photo.title,
        url: photo.url,
    };

    photos.push(newPhoto);
    callback(newPhoto);
};

const updatePhotoWS = (id, title, url, callback) => {
    const photoIndex = photos.findIndex((photo) => photo.id === id);

    if (photoIndex === -1) {
        return;
    }

    photos[photoIndex] = { id, title, url };
    callback(photos[photoIndex]);
};

const deletePhotoWS = (id, callback) => {
    const photoIndex = photos.findIndex((photo) => photo.id === id);

    if (photoIndex === -1) {
        return;
    }

    photos.splice(photoIndex, 1);
    callback(id);
};

exports.getPhotos = (req, res) => {
    res.status(200).json(photos);
};

exports.getPhotoById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const photo = photos.find((photo) => photo.id === id);

    if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
    }

    res.status(200).json(photo);
};

exports.addPhoto = (req, res, callback) => {
    const { title, url } = req.body;
    addPhotoWS({ title, url }, (newPhoto) => {
        req.app.io.emit('photoAdded', newPhoto);
        res.status(201).json(newPhoto);
        callback(newPhoto);
    });
};


exports.updatePhoto = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, url } = req.body;
    updatePhotoWS(id, title, url, (updatedPhoto) => {
        if (!updatedPhoto) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        req.app.io.emit('photoUpdated', updatedPhoto);
        res.status(200).json(updatedPhoto);
    });
};

exports.deletePhoto = (req, res) => {
    const id = parseInt(req.params.id, 10);
    deletePhotoWS(id, (deletedId) => {
        if (!deletedId) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        req.app.io.emit('photoDeleted', deletedId);
        res.status(200).json({ message: 'Photo deleted successfully' });
    });
};

