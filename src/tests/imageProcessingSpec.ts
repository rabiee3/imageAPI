import imageProcessing from "../imageProcessing";

const width = 100;
const height = 100;

describe("***Image processing functions***", () => {
    it("expects 'createImage' function to return a buffer (not false)", () => {
        expect(imageProcessing.createImage(width, height)).toBeTruthy();
    });

    it("expects 'readImageFromDisk' function to return a buffer (not false)", () => {
        expect(imageProcessing.readImageFromDisk(width, height)).toBeTruthy();
    });

    it("expects 'resizeImage' function to return a Sharp object (not false)", () => {
        expect(
            imageProcessing.resizeImage(width, height, "nature.png")
        ).toBeTruthy();
    });
});
