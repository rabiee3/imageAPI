import * as fs from "fs";
import * as canvas from "canvas";
import * as sharp from "sharp";
import { Sharp } from "sharp";

export default class imageProcess {
    static createImage(
        width: number,
        height: number,
        dirName: string
    ): Buffer | string {
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
            return `file write error : ${err}`;
        }
    }

    static readImageFromDisk(
        width: number,
        height: number,
        dirName: string,
        fileName?: string
    ): Buffer | string {
        try {
            if (fileName) {
                return fs.readFileSync(
                    `${dirName}/${fileName}-${width}x${height}.png`
                );
            }
            return fs.readFileSync(`${dirName}/${width}x${height}.png`);
        } catch (err) {
            return `image read error : ${err}`;
        }
    }

    static resizeImage(
        width: number,
        height: number,
        srcDirName: string,
        dirName: string,
        name: string
    ): Promise<Buffer | string> {
        return new Promise(res => {
            const readStream = fs
                .createReadStream(`${srcDirName}/${name}.png`)
                .on("error", err => {
                    res(
                        `<h3>Error: Source file not found</h3><br/>${err.message.toString()}`
                    );
                });
            let transform = sharp() as Sharp;
            transform = transform.resize(width, height);
            readStream
                .pipe(transform)
                .toBuffer()
                .then(data => {
                    if (!fs.existsSync(dirName)) {
                        fs.mkdirSync(dirName);
                    }
                    try {
                        fs.writeFileSync(
                            `${dirName}/${name}-${width}x${height}.png`,
                            data
                        );
                        res(data);
                    } catch (err) {
                        res(`error creating file: ${err}`);
                    }
                });
        });
    }
}
