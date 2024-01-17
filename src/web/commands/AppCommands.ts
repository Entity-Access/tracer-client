import Command, { Commands } from "@web-atoms/core/dist/core/Command";

export default class AppCommands extends Commands {

    static openHome = Command.create({
        route: "/",
        routeOrder: 200,
        openPage: () => import("../page/home/HomePage")
    });

    static setupMultiFactor = Command.create({
        route: "/user/multi-factor/setup",
        pushPage: () => import("../page/user/multi-factor/MultiFactorSetupPage")
    });

    static changePassword = Command.create({
        route: "/user/change-password",
        pushPage: () => import("../page/user/change-password/ChangePasswordPage")
    });

    static sourceList = Command.create({
        route: "/sources",
        routeOrder: 200,
        openPage: () => import("../page/sources/SourceListPage")
    })
}
