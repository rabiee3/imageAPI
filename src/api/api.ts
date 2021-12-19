import * as express from "express";
import imageProcess from "../imageProcessing";
import { ICachedImage } from "../interfaces/ICashedImage";
import config from "../config/environment";

const alreadySavedPlacehoders: ICachedImage[] = [];
const alreadySavedImageThumbs: ICachedImage[] = [];

const apiRouter = express.Router();

// api home route
apiRouter.get("/api", (req, res) => {
    res.status(200);
    res.send(
        `<h3>API Listening on http://localhost:${config.port}/api</h3> <hr/> Image Placeholder: <br/> http://localhost:${config.port}/api/placeholder/width/height <br/><br/> Image Resize from 'full' folder: <br/> http://localhost:${config.port}/api/image</div>`
    );
});

// providing image placeholder with resize
apiRouter.get("/api/placeholder/:width/:height", (req, res) => {
    const width: number = parseInt(req.params.width, 10);
    const height: number = parseInt(req.params.height, 10);

    if (Number.isNaN(width)) {
        res.status(500);
        res.send("Please enter correct width value");
    }

    if (Number.isNaN(height)) {
        res.status(500);
        res.send("Please enter correct height value");
    }

    let alreadySaved = false;
    alreadySavedPlacehoders.forEach(item => {
        if (item.width === width && item.height === height) {
            alreadySaved = true;
        }
    });
    res.set({ "Content-Type": "image/png" });
    if (alreadySaved) {
        if (
            imageProcess.readImageFromDisk(
                width,
                height,
                config.placeholderDirName
            )
        ) {
            res.send(
                imageProcess.readImageFromDisk(
                    width,
                    height,
                    config.placeholderDirName
                )
            );
        } else {
            res.status(404);
            res.send("Cached File Not Found");
        }
    } else {
        if (
            imageProcess.createImage(width, height, config.placeholderDirName)
        ) {
            res.send(
                imageProcess.createImage(
                    width,
                    height,
                    config.placeholderDirName
                )
            );
        } else {
            res.status(500);
            res.send("Something wrong happened, please try again");
        }
        alreadySavedPlacehoders.push({ width, height });
    }
});

// image resize from 'full' folder
apiRouter.get("/api/image", async (req, res) => {
    const width: number = parseInt(req.query.width as string, 10);
    const height: number = parseInt(req.query.height as string, 10);
    const name: string = req.query.name as string;

    if (Number.isNaN(width)) {
        res.status(500);
        res.send("Please enter correct width value");
    }

    if (Number.isNaN(height)) {
        res.status(500);
        res.send("Please enter correct height value");
    }

    if (!name) {
        res.status(500);
        res.send("Please enter correct name value");
    }

    res.set({ "Content-Type": "image/png" });

    let alreadySavedThumb = false;
    alreadySavedImageThumbs.forEach(item => {
        if (
            item.width === width &&
            item.height === height &&
            item.name === name
        ) {
            alreadySavedThumb = true;
        }
    });
    res.set({ "Content-Type": "image/png" });
    if (alreadySavedThumb) {
        if (
            typeof imageProcess.readImageFromDisk(
                width,
                height,
                config.thumbsDirName,
                name
            ) !== "string"
        ) {
            res.send(
                imageProcess.readImageFromDisk(
                    width,
                    height,
                    config.thumbsDirName,
                    name
                )
            );
        } else {
            res.status(404);
            res.send("Cached File Not Found");
        }
    } else {
        imageProcess
            .resizeImage(
                width,
                height,
                config.srcDirName,
                config.thumbsDirName,
                name
            )
            .then(data => {
                if (typeof data === "string") {
                    res.set({ "Content-Type": "text/html; charset=utf-8" });
                }
                res.send(data);
            });
        alreadySavedImageThumbs.push({ width, height, name });
    }
});

export default apiRouter;
