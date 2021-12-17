import * as express from 'express';
import imageProcess from './imageProcessing';

const app = express();
const port = 3000;
interface ICachedImage {
    width:number;
    height:number;
}
const alreadySavedImages:ICachedImage[] = [];

app.listen(port, () => {
    console.log(`API Listening on http://localhost:${port}`);
});

app.get('/api', (req, res) => {
    res.send(`<h3>API Listening on http://localhost:${port}/api</h3> <hr/> Image Placeholder: <br/> http://localhost:${port}/api/placeholder/width/height <br/><br/> Image Resize from 'full' folder: <br/> http://localhost:${port}/api/image</div>`);
});

// providing image placeholder with resize
app.get('/api/placeholder/:width/:height', (req, res) => {
    const width:number = parseInt(req.params.width, 10);
    const height:number = parseInt(req.params.height, 10);

    let alreadySaved = false;
    alreadySavedImages.forEach((item) => {
        if (item.width === width && item.height === height) {
            alreadySaved = true;
        }
    });
    res.set({ 'Content-Type': 'image/png' });
    if (alreadySaved) {
        if (imageProcess.readImageFromDisk(width, height)) {
            res.send(imageProcess.readImageFromDisk(width, height));
        } else {
            res.status(404);
            res.send("Cached File Not Found");
        }
    } else {
        if (imageProcess.createImage(width, height)) {
            res.send(imageProcess.createImage(width, height));
        } else {
            res.status(500);
            res.send("Something wrong happened, please try again");
        }
        alreadySavedImages.push({ width, height });
    }
});

// image resize
app.get('/api/image', (req, res) => {
    const width:number = parseInt(req.query.width as string, 10);
    const height:number = parseInt(req.query.height as string, 10);
    res.set({ 'Content-Type': 'image/png' });
    // res.send(imageProcess.resizeImage(width, height, req.query.filename as string));
});
