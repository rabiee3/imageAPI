import * as fs from "fs";
import * as canvas from "canvas";
import * as sharp from "sharp";
import { Sharp } from "sharp";

const environment = process.env.NODE_ENV || "production";

export default class imageProcess {
    static createImage(width: number, height: number): Buffer | boolean {
        const dirName =
            environment === "production"
                ? "./placeholderThumbs"
                : "./dist/placeholderThumbs";

        const imageCanvas = canvas.createCanvas(width, height);
        const context = imageCanvas.getContext("2d");

        context.fillStyle = "#764abc";
        context.font = "30px Arial";
        context.fillRect(0, 0, width, height);
        if (width < 200 || height < 200) {
            context.font = "10px Arial";
        }
        context.textAlign = "center";
        context.fillStyle = "#000000";
        context.fillText(`${width} X ${height}`, width / 2, height / 2);
        const buffer = imageCanvas.toBuffer("image/png");
        try {
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
            }
            fs.writeFileSync(`${dirName}/${width}x${height}.png`, buffer);
            return buffer;
        } catch (err) {
            return false;
        }
    }

    static readImageFromDisk(width: number, height: number): Buffer | boolean {
        const dirName =
            environment === "production"
                ? "./placeholderThumbs"
                : "./dist/placeholderThumbs";
        try {
            return fs.readFileSync(`${dirName}/${width}x${height}.png`);
        } catch (err) {
            return false;
        }
    }

    static resizeImage(
        width: number,
        height: number,
        path: string
    ): Sharp | boolean {
        const dirName = environment === "production" ? "./full" : "./dist/full";
        try {
            const readStream = fs.createReadStream(`${dirName}/${path}`);
            let transform = sharp();
            transform = transform.resize(width, height);
            return readStream.pipe(transform);
        } catch (error) {
            return false;
        }
    }
}
