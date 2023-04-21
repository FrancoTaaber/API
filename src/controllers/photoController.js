const photos = require('../models/photo');


const addPhotoWS = (userId, photo, callback) => {
    const maxId = Math.max(...photos.map((p) => p.id));
    const newPhoto = {
        id: maxId === -Infinity ? 1 : maxId + 1,
        userId: userId,
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

exports.addPhoto = (req, res, userId, callback) => {
    const { title, url } = req.body;
    const id = Math.max(...photos.map((p) => p.id));
    const newPhoto = {
        id: id === -Infinity ? 1 : id + 1,
        title: title,
        url: url,
        userId: userId,
    };
    photos.push(newPhoto);
    req.app.io.emit('photoAdded', newPhoto);
    res.status(201).json(newPhoto);
    callback(newPhoto);
};

exports.updatePhoto = (req, res, userId) => {
    const id = parseInt(req.params.id, 10);
    const { title, url } = req.body;
    const photoIndex = photos.findIndex((photo) => photo.id === id);

    console.log("User ID:", userId);
    console.log("Photo owner ID:", photos[photoIndex].userId);

    if (photoIndex === -1) {
        res.status(404).json({ message: 'Photo not found' });
    } else if (photos[photoIndex].userId !== userId) {
        res.status(403).json({ error: "Not authorized to update this photo" });
    } else {
        photos[photoIndex] = { id, title, url, userId: photos[photoIndex].userId };
        req.app.io.emit('photoUpdated', photos[photoIndex]);
        res.status(200).json(photos[photoIndex]);
    }
};


exports.deletePhoto = (req, res, userId) => {
    const id = parseInt(req.params.id, 10);
    const photoIndex = photos.findIndex((photo) => photo.id === id);

    if (photoIndex === -1) {
        res.status(404).json({ message: 'Photo not found' });
    } else if (photos[photoIndex].userId !== userId) {
        res.status(403).json({ error: "Not authorized to delete this photo" });
    } else {
        const deletedId = photos[photoIndex].id;
        photos.splice(photoIndex, 1);
        req.app.io.emit('photoDeleted', deletedId);
        res.status(200).json({ message: 'Photo deleted successfully' });
    }
};

