import * as fs from 'fs';
import * as canvas from 'canvas';
import * as path from 'path';

const environment = process.env.NODE_ENV || 'production';

export default class imageProcess {
    static createImage(width:number, height:number) :Buffer|boolean {
        const dirName = environment === 'production' ? './thumb' : './dist/thumb';

        const imageCanvas = canvas.createCanvas(width, height);
        const context = imageCanvas.getContext("2d");

        context.fillStyle = "#764abc";
        context.font = "30px Arial";
        context.fillRect(0, 0, width, height);
        if (width < 200 || height < 200) {
            context.font = "10px Arial";
        }
        context.textAlign = 'center';
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
            console.log(err);
            return false;
        }
    }

    static readImageFromDisk(width:number, height:number) :Buffer|boolean {
        const dirName = environment === 'production' ? './thumb' : './dist/thumb';
        try {
            return fs.readFileSync(`${dirName}/${width}x${height}.png`);
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    static readFullImageFromDisk(filename:string) :Buffer|boolean {
        try {
            return fs.readFileSync(filename);
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    // static resizeImage(width:number, height:number, filename:string) :Buffer|boolean {
    //     const imageCanvas2 = canvas.createCanvas(width, height);
    //     const context = imageCanvas2.getContext("2d");

    //     const image = new Image();
    //     image.onload = () => {
    //         context.drawImage(image, 0, 0);
    //     };
    //     image.src = imageProcess.readFullImageFromDisk(filename).toString('base64');

    //     const ouputBuffer = imageCanvas2.toBuffer("image/png");
    //     return ouputBuffer;
    // }
}
