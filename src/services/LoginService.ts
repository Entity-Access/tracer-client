import DISingleton from "@web-atoms/core/dist/di/DISingleton";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import EntityService from "./EntityService";
import { ILoginSession, IUser, LoginSession, User } from "../model/model";
import SocialMailApp from "../common/SocialMailApp";
import { App } from "@web-atoms/core/dist/App";
import WebPushService from "./WebPushService";

@DISingleton()
export default class LoginService {

    @Inject
    private entityService: EntityService;

    @Inject
    private app: App;

    private user: IUser;

    public async getUser() {
        this.user ??= (await this.entityService.query(LoginSession, "currentUser").firstOrDefault())?.user;
        SocialMailApp.user = this.user;
        return this.user;
    }

    public async login(session: ILoginSession) {
        await this.entityService.save(session);
        if(session.invalid) {
            return session.status;
        }
        location.reload();
    }

    async updateRegistration(s: PushSubscription) {
        throw new Error("Method not implemented.");
    }

    async logout() {
        const session = await this.entityService.query(LoginSession, "currentUser").firstOrDefault();
        session.invalid = true;
        const cloner = this.entityService.cloner(session);
        await this.entityService.save(cloner.copy);
        location.reload();
    }

}