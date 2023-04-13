const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const photoController = require('./controllers/photoController');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// API routes
app.get('/photos', photoController.getPhotos);
app.get('/photos/:id', photoController.getPhotoById);
app.post('/photos', photoController.addPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
