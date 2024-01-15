import XNode from "@web-atoms/core/dist/core/XNode";
import { Drawer } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import AdminCommands from "../../admin/commands/AdminCommands";
import SocialMailApp from "../../common/SocialMailApp";
import MenuItem from "../../common/controls/menu/MenuItem";
import { IUser } from "../../model/model";
import styled from "@web-atoms/core/dist/style/styled";
import AppCommands from "../commands/AppCommands";
import { ExpanderMenu } from "@web-atoms/web-controls/dist/basic/Expander";
import MailboxService from "../../common/pages/mailboxes/services/MailboxService";
import CloudFileService from "../page/files/service/CloudFileService";
import { toFileSize } from "../../common/NumberFormats";
import Action from "@web-atoms/core/dist/view-model/Action";
import CommonCommands from "../../common/commands/CommonCommands";
import LoginService from "../../services/LoginService";

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

        this.user = SocialMailApp.user;

        const { mailboxes, channels, drives, websites } = await this.getItems();

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
                { mailboxes.length && <ExpanderMenu isExpanded={true}>
                    <MenuItem
                        icon="fas fa-envelope"
                        label="Mailboxes"
                        commandLink={null}
                        />
                    { ... mailboxes.map((mb) => <MenuItem
                        commandLink={AppCommands.openMailbox.displayRoute({ id: mb.mailboxID })}
                        label={mb.emailAddress.name}
                        description={mb.emailAddress.emailAddress}
                        title={mb.emailAddress.emailAddress}
                        />)}
                    <MenuItem
                        label="All"
                        commandLink={AppCommands.openMailboxList.displayRoute({})}
                    />
                </ExpanderMenu> }
                { channels.length && <ExpanderMenu isExpanded={true}>
                    <MenuItem
                        icon="fas fa-hard-drive"
                        label="Channels"
                        commandLink={null}
                        />
                    { ... channels.map((mb) => <MenuItem
                        commandLink={AppCommands.openMailbox.displayRoute({ id: mb.mailboxID })}
                        label={mb.emailAddress.name}
                        description={mb.emailAddress.emailAddress}
                        title={mb.emailAddress.emailAddress}
                        />)}
                </ExpanderMenu> }
                { drives.length && <ExpanderMenu isExpanded={true}>
                    <MenuItem
                        icon="fas fa-hard-drive"
                        label="Drives"
                        commandLink={null}
                        />
                    { ... drives.map((d) => <MenuItem
                        commandLink={AppCommands.openFiles.displayRoute({ id: d.appFileID })}
                        label={d.name}
                        description={`${d.creator?.displayName} ${ BigInt(d.fileSize) > BigInt(0) ? "(" + toFileSize(d.fileSize) + ")" : ""}`}
                        />)}
                    <MenuItem
                        label="All"
                        commandLink={AppCommands.openDrives.displayRoute({})}
                    />
                </ExpanderMenu> }
                { websites.length && <ExpanderMenu isExpanded={true}>
                    <MenuItem
                        icon="fas fa-hard-drive"
                        label="Web Sites"
                        commandLink={null}
                        />
                    { ... websites.map((d) => <MenuItem
                        commandLink={AppCommands.manageWebSite.displayRoute({ id: d.appFileID })}
                        label={d.name}
                        description={`${d.creator?.displayName} ${ BigInt(d.fileSize) > BigInt(0) ? "(" + toFileSize(d.fileSize) + ")" : ""}`}
                        />)}
                    <MenuItem
                        label="All"
                        commandLink={AppCommands.openWebSiteList.displayRoute({})}
                    />
                </ExpanderMenu> }
                <MenuItem
                    icon="fas fa-money-check-pen"
                    label="Templates"
                    commandLink={AppCommands.openTemplates.displayRoute({ templates: true })}
                    />
                <MenuItem
                    icon="fas fa-envelopes-bulk"
                    label="All Mailboxes"
                    commandLink={AppCommands.openMailboxList.displayRoute({})}
                    />
                {/* <MenuItem
                    icon="fas fa-envelopes-bulk"
                    label="All Mailboxes"
                    commandLink={AppCommands.openMailboxList.displayRoute({})}
                    />
                {/* <MenuItem
                    icon="fas fa-folder"
                    label="Files"
                    commandLink={AppCommands.openFiles.displayRoute({})}
                    /> */}
                <ExpanderMenu isExpanded={false}>
                    <MenuItem
                        icon="fas fa-gears"
                        label={"Account Settings"}
                        />
                    <MenuItem
                        label="Change Password"
                        commandLink={CommonCommands.changePassword.displayRoute({})}
                        />
                    <MenuItem
                        label="Multi Factor"
                        commandLink={CommonCommands.setupMultiFactor.displayRoute({})}
                        />
                    <MenuItem
                        label="Logout"
                        data-click-event="user-logout"
                        />
                </ExpanderMenu>
            </div>
        </div>;

    }

    async getItems() {
        const ms = this.resolve(MailboxService);
        const fs = this.resolve(CloudFileService);
        const [mailboxes, channels, drives, websites] = await Promise.all([
            ms.top(),
            ms.top({ isChannel: true }),
            fs.top(),
            fs.top(true)
        ]);
        return { mailboxes, channels, drives, websites };
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
