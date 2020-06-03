import {UploadController} from "./upload.controller";

export class UploadRoutes {

    public uploadController: UploadController = new UploadController()

    public routes(app): void {

        app.route('/upload/:type').post(this.uploadController.process)
        app.route('/upload64').post(this.uploadController.processBase64)

    }
}
