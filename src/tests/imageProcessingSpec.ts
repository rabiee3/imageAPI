import imageProcessing from "../imageProcessing";

const width = 100;
const height = 100;
const environment = process.env.NODE_ENV || "production";
const srcImageDir = environment === "production" ? "./full" : "./dist/full";
const placeholderDirName =
    environment === "production"
        ? "./placeholderThumbs"
        : "./dist/placeholderThumbs";

describe("***Image processing functions***", () => {
    it("expects 'createImage' function to return a buffer", () => {
        expect(
            imageProcessing.createImage(width, height, placeholderDirName)
        ).not.toContain("file write error");
    });

    it("expects 'readImageFromDisk' function to return a buffer", () => {
        expect(
            imageProcessing.readImageFromDisk(width, height, placeholderDirName)
        ).not.toContain("image read error");
    });

    it("expects 'resizeImage' function to return a Sharp object", () => {
        expect(
            imageProcessing.resizeImage(width, height, srcImageDir, "nature")
        ).toBeTruthy();
    });
});
