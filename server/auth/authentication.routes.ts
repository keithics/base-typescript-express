import * as authentication from './authentication.controller'

export class AuthenticationRoutes {



    public routes(app): void {
        app.route('/login/admin').post(authentication.loginAdmin)
    }
}
