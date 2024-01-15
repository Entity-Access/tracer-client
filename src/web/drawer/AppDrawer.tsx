import XNode from "@web-atoms/core/dist/core/XNode";
import { Drawer } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import { IUser } from "../../model/model";
import styled from "@web-atoms/core/dist/style/styled";
import AppCommands from "../commands/AppCommands";
import { ExpanderMenu } from "@web-atoms/web-controls/dist/basic/Expander";
import Action from "@web-atoms/core/dist/view-model/Action";
import LoginService from "../../services/LoginService";
import GlobalApp from "../../GlobalApp";
import MenuItem from "../../controls/menu/MenuItem";

const css = styled.css `
    min-width: 300px;

    background-color: var(--accent-color);

    display: grid;
    grid-template-rows: auto 1fr;

    & > .header {
        grid-row: 1;
    }
    & > .menus {
        grid-row: 2;
        background-color: canvas;
        padding: var(--spacing);
        margin: var(--spacing);
        border-radius: 10px;
    }

`.installLocal();

declare let BigInt: any;

export default class AppDrawer extends Drawer {

    private user: IUser;

    private selected: HTMLElement;

    async init() {
        this.element.className = css;

        this.user = GlobalApp.user;

        this.renderer = <div>
            <div
                class="header"
                data-padding="large"
                data-font-size="large"
                data-color="white"
                text="Social Mail"/>
            <div
                class="menus"
                >
                <MenuItem
                    icon="fas fa-home"
                    label="Home"
                    commandLink={AppCommands.openHome.displayRoute({})}
                    />
                <ExpanderMenu isExpanded={false}>
                    <MenuItem
                        icon="fas fa-gears"
                        label={"Account Settings"}
                        />
                    <MenuItem
                        label="Change Password"
                        commandLink={AppCommands.changePassword.displayRoute({})}
                        />
                    <MenuItem
                        label="Multi Factor"
                        commandLink={AppCommands.setupMultiFactor.displayRoute({})}
                        />
                    <MenuItem
                        label="Logout"
                        data-click-event="user-logout"
                        />
                </ExpanderMenu>
            </div>
        </div>;

    }

    @Action({ onEvent: "user-logout"})
    async userLogout() {
        const loginService = this.resolve(LoginService);
        await loginService.logout();
    }

    @Action({ onEvent: "click"})
    onClick(none, e: MouseEvent) {
        this.selected?.removeAttribute("data-selected");
        let start = e.target as HTMLElement;
        while(start !== e.currentTarget) {
            if (start.getAttribute("data-layout") === "menu-item") {
                start.setAttribute("data-selected", "true");
                this.selected = start;
                break;
            }
            start = start.parentElement;
        }
    }
}
