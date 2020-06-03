import {IndexController} from './index.controller'

export class IndexRoutes {

    public indexController: IndexController = new IndexController()

    public routes(app): void {

        app.route('/').get(this.indexController.home)

    }
}
