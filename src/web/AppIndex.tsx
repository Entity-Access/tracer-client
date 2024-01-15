import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import MobileDesktopApp from "@web-atoms/web-controls/dist/desktop-app/MobileDesktopApp";
import styled from "@web-atoms/core/dist/style/styled";
import Route from "@web-atoms/core/dist/core/Route";
import PageNavigator from "@web-atoms/web-controls/dist/PageNavigator";
import Command from "@web-atoms/core/dist/core/Command";
import AppCommands from "./commands/AppCommands";

import "../style/GlobalStyle";
import LoginService from "../services/LoginService";
import AppDrawer from "./drawer/AppDrawer";
import sleep from "@web-atoms/core/dist/core/sleep";
import WebPushService from "../services/WebPushService";
import LocalFileService from "../services/LocalFileService";
import LoginPage from "./page/user/login/LoginPage";
import { ModuleInfo } from "../controls/ModuleInfo";

@Pack
export default class AppIndex extends MobileDesktopApp {

    @InjectProperty
    private userService: LoginService;

    async init() {
        AppCommands.install(this);

        // attach upload events..
        this.resolve(LocalFileService);

        // check if we are logged in...
        const currentUser = await this.userService.getUser();
        if (!currentUser) {
            PageNavigator.openPage(LoginPage);
            return;
        }

        this.drawerMenu = AppDrawer;

        if(!Command.invokeRoute()) {

            // check if we are configured...

            if (!currentUser.multiFactor) {
                AppCommands.setupMultiFactor.dispatch();
            } else {
                AppCommands.openHome.dispatch();
            }
        }

        if (this.desktopApp) {
            this.desktopApp.statusBarRenderer = () => <div data-layout="row">
                <a href="/admin" target="_blank">Admin</a>
                <div data-flex="stretch-full"/>
                { ... ModuleInfo}
            </div>;
        }

        await sleep(500);
        await this.resolve(WebPushService).register();
    }
}

Route.encodeUrl = (url) => {
    if (url.startsWith("#")) {
        return url;
    }
    if (/\d+\./.test(location.hostname)) {
        return "#!" + url;
    }
    return url;
};
