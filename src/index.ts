import * as express from "express";
import config from "./config/environment";
import apiRouter from "./api/api";

const app = express();

app.listen(config.port, () => {
    console.log(
        `API Listening on http://localhost:${config.port}/api\n\n  Image Placeholder: \n http://localhost:${config.port}/api/placeholder/width/height \n\n Image Resize from 'full' folder: \n http://localhost:${config.port}/api/image`
    );
});

app.use("/", apiRouter);

export default app;
