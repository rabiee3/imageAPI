import * as express from "express";
import { Sharp } from "sharp";
import imageProcess from "./imageProcessing";

const app = express();
const port = 3000;
interface ICachedImage {
    width: number;
    height: number;
}
const alreadySavedPlacehoders: ICachedImage[] = [];
const environment = process.env.NODE_ENV || "production";
const srcImageDir = environment === "production" ? "./full" : "./dist/full";
const placeholderDirName =
    environment === "production"
        ? "./placeholderThumbs"
        : "./dist/placeholderThumbs";

app.listen(port, () => {
    // console.log(`API Listening on http://localhost:${port}`);
});

// api home route
app.get("/api", (req, res) => {
    res.status(200);
    res.send(
        `<h3>API Listening on http://localhost:${port}/api</h3> <hr/> Image Placeholder: <br/> http://localhost:${port}/api/placeholder/width/height <br/><br/> Image Resize from 'full' folder: <br/> http://localhost:${port}/api/image</div>`
    );
});

// providing image placeholder with resize
app.get("/api/placeholder/:width/:height", (req, res) => {
    const width: number = parseInt(req.params.width, 10);
    const height: number = parseInt(req.params.height, 10);

    let alreadySaved = false;
    alreadySavedPlacehoders.forEach(item => {
        if (item.width === width && item.height === height) {
            alreadySaved = true;
        }
    });
    res.set({ "Content-Type": "image/png" });
    if (alreadySaved) {
        if (imageProcess.readImageFromDisk(width, height, placeholderDirName)) {
            res.send(
                imageProcess.readImageFromDisk(
                    width,
                    height,
                    placeholderDirName
                )
            );
        } else {
            res.status(404);
            res.send("Cached File Not Found");
        }
    } else {
        if (imageProcess.createImage(width, height, placeholderDirName)) {
            res.send(
                imageProcess.createImage(width, height, placeholderDirName)
            );
        } else {
            res.status(500);
            res.send("Something wrong happened, please try again");
        }
        alreadySavedPlacehoders.push({ width, height });
    }
});

// image resize from 'full' folder
app.get("/api/image", (req, res) => {
    const width: number = parseInt(req.query.width as string, 10);
    const height: number = parseInt(req.query.height as string, 10);
    const name: string = req.query.name as string;
    res.set({ "Content-Type": "image/png" });
    const processedImage = imageProcess.resizeImage(
        width,
        height,
        srcImageDir,
        name
    ) as Sharp;
    processedImage.toBuffer().then((result: Buffer) => res.send(result));
});

export default app;
