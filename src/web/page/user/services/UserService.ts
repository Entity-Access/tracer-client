import DITransient from "@web-atoms/core/dist/di/DITransient";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import EntityService from "../../../../services/EntityService";
import { IUser, IUserAuthFactor, User, UserAuthFactor } from "../../../../model/model";
import SocialMailApp from "../../../SocialMailApp";

@DITransient()
export default class UserService {

    @Inject
    private entityService: EntityService;

    async getCurrent() {

        const { userID } = SocialMailApp.user;

        return this.entityService.query(User)
            .where({ userID }, (p) => (x) => x.userID === p.userID)
            .include((x) => x.authFactors)
            .firstOrDefault();
    }

    async save(user: IUser) {
        let cloner = this.entityService.cloner(user)
            .include((x) => x.authFactors);
        if (user.changePassword) {
            cloner = cloner.include((x) => x.changePassword) as any;
        }
        await this.entityService.save(cloner.copy);
    }

    async createAuthFactor(user: IUser, method: IUserAuthFactor["method"] = "totp") {
        const authFactor = UserAuthFactor.create({
            method
        });
        (user.authFactors ??= []).add(authFactor);
        await this.save(user);
        return authFactor;
    }

}