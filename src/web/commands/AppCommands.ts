import Command, { Commands } from "@web-atoms/core/dist/core/Command";

export default class AppCommands extends Commands {

    static openHome = Command.create({
        route: "/",
        routeOrder: 200,
        openPage: () => import("../page/home/HomePage")
    });

}
