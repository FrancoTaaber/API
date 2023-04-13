const photos = require('../models/photo');

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

exports.addPhoto = (req, res) => {
    const { title, url } = req.body;
    const newPhoto = {
        id: photos.length + 1,
        title,
        url,
    };

    photos.push(newPhoto);
    res.status(201).json(newPhoto);
};

exports.updatePhoto = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, url } = req.body;
    const photoIndex = photos.findIndex((photo) => photo.id === id);

    if (photoIndex === -1) {
        return res.status(404).json({ message: 'Photo not found' });
    }

    photos[photoIndex] = { id, title, url };
    res.status(200).json(photos[photoIndex]);
};

exports.deletePhoto = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const photoIndex = photos.findIndex((photo) => photo.id === id);

    if (photoIndex === -1) {
        return res.status(404).json({ message: 'Photo not found' });
    }

    photos.splice(photoIndex, 1);
    res.status(200).json({ message: 'Photo deleted successfully' });
};
