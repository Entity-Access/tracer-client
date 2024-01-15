import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import { IUser, IUserAuthFactor, UserAuthFactor } from "../../../../model/model";
import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import UserService from "../services/UserService";
import XNode from "@web-atoms/core/dist/core/XNode";
import Form from "@web-atoms/web-controls/dist/basic/Form";
import FormField from "@web-atoms/web-controls/dist/basic/FormField";
import Bind from "@web-atoms/core/dist/core/Bind";
import Action from "@web-atoms/core/dist/view-model/Action";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import { DateFormats } from "../../../../common/date/DateFormats";
import { AddIconTextButton, DeleteIconTextButton, SaveIconTextButton } from "../../../../controls/buttons/IconButton";

export default class MultiFactorSetupPage extends ContentPage {

    model: IUser;

    @InjectProperty
    userService: UserService;

    authFactor: IUserAuthFactor;

    async init() {
        this.model = await this.userService.getCurrent();

        const { multiFactor } = this.model;

        this.title = "Setup Multi Factor Authentication";
        if (!this.model.authFactors?.length) {
            await this.notSetup();
            return;
        }

        if (multiFactor) {
            this.renderer = <div data-layout="center-page-900px">
                <Form>
                    <FormField label="Methods">
                        <AtomRepeater
                            for="table"
                            items={this.model.authFactors}
                            itemRenderer={(item) => this.renderAuthFactor(item)}
                            />
                    </FormField>
                    { !multiFactor && <div data-layout="command-row">
                        <AddIconTextButton
                            event-click={() => this.addAuthenticator()}
                            text="Add Authenticator"
                        />
                        <AddIconTextButton
                            event-click={() => this.generateOTP()}
                            text="Generate OTP"
                        />
                    </div> }
                    <div data-layout="command-row">
                        <div>Multi factor authentication is enabled.</div>
                        <DeleteIconTextButton
                            text="Disable"
                            />
                    </div>
                </Form>
            </div>;
            return;
        }

        const disable = !this.model.authFactors?.length
        || !this.model.authFactors.some((i) => i.method === "totp" && i.verified)
        || this.model.authFactors.filter((i) => i.method === "one-time").length < 8;

        this.renderer = <div data-layout="center-page-900px">
            <Form>
                <FormField label="Methods">
                    <AtomRepeater
                        for="table"
                        items={this.model.authFactors}
                        itemRenderer={(item) => this.renderAuthFactor(item)}
                        />
                </FormField>
                { !multiFactor && <div data-layout="command-row">
                    <AddIconTextButton
                        event-click={() => this.addAuthenticator()}
                        text="Add Authenticator"
                    />
                    <AddIconTextButton
                        event-click={() => this.generateOTP()}
                        text="Generate OTP"
                    />
                </div> }
                { disable && <div>
                    You must add at least one authenticator and generate 8 OTPs (one time passwords) to
                    enable Multi factor authentication.
                </div> }
                { !multiFactor && <div data-layout="command-row">
                    <SaveIconTextButton
                        disabled={disable}
                        style-color={disable ? "gray" : ""}
                        data-click-event="enable-multi-factor"
                        text="Enable"
                        />
                    <DeleteIconTextButton
                        data-submit-event="clear-all"
                        text="Clear All"
                        />
                </div> }
                { multiFactor && <div data-layout="command-row">
                    <DeleteIconTextButton
                        text="Disable"
                        />
                </div>}
            </Form>
        </div>;
    }

    renderAuthFactor(item: IUserAuthFactor): XNode {
        if (item.method === "totp") {
            return <tr>
                <td>Authenticator</td>
                <td>{item.hint}</td>
                <td>{DateFormats.relative.short(item.dateUpdated)}</td>
                <td><i class="fas fa-check green"/></td>
            </tr>;
        }

        if (item.method === "one-time") {
            return <tr>
                <td>OTP</td>
                <td>{item.hint}*****************</td>
                <td>{DateFormats.relative.short(item.dateUpdated)}</td>
                <td><i class="fas fa-check green"/></td>
            </tr>;
        }
        return <tr>
                <td>{item.method}</td>
                <td>{item.hint}</td>
                <td>{DateFormats.relative.short(item.dateUpdated)}</td>
                <td><i class="fas fa-check green"/></td>
            </tr>;
        }

    async notSetup() {
        this.renderer = <div data-layout="center-page-900px">
            <p>You account is not secure, please setup multi factor authentication.</p>
            <AddIconTextButton
                event-click={() => this.addAuthenticator()}
                text="Add Authenticator"
                />
        </div>;
    }

    async addAuthenticator() {

        const authFactor = await this.userService.createAuthFactor(this.model);
        this.authFactor = authFactor;
        this.renderer = <div data-layout="center-page-900px">
            <Form>
                <FormField label="">
                    <div>Scan following QR Code in any compatible Authenticator App. Enter the generated code and hit the verify button.</div>
                </FormField>
                <FormField label="Secret">
                    <img
                        src={authFactor.qrCodeDataUrl}
                        />
                </FormField>
                <FormField
                    label="Code"
                    required={true}
                    error={Bind.oneWay(() => this.authFactor.token ? "" : "Code is required")}
                    >
                    <input type="tel" value={Bind.twoWaysImmediate(() => this.authFactor.token)}/>
                </FormField>
                <div data-layout="command-row">
                    <SaveIconTextButton
                        data-submit-event="save-auth-factor"
                        text="Verify"
                        />
                </div>
            </Form>
        </div>;
    }

    async generateOTP() {
        const authList = (this.model.authFactors ??= []) as IUserAuthFactor[];
        for (let index = 0; index < 8; index++) {
            authList.push(UserAuthFactor.create({
                method: "one-time"
            }));
        }
        await this.userService.save(this.model);
        let text = "";
        for (const iterator of authList) {
            if (!iterator?.displaySecret) {
                continue;
            }
            text += "\r\n" + iterator.displaySecret;
        }
        text += "\r\n";
        this.renderer = <div data-layout="center-page-900px">
            <Form>
                <FormField label="One Time Passwords">
                    <div>Please copy and save these passwords somewhere safe. You can use
                        them if you cannot access Authenticator app.
                    </div>
                </FormField>
                <FormField label="">
                    <textarea
                        rows={12}
                        value={text}
                        />
                </FormField>
                <div>
                    After copying, click go to previous screen.
                </div>
                <div data-layout="command-row">
                    <SaveIconTextButton
                        event-click={() => this.init()}
                        text="Go"
                        />
                </div>
            </Form>
        </div>;
    }

    @Action({ onEvent: "clear-all", confirm: "Are you sure you want to delete all existing methods?"})
    async clearAll() {
        const all = this.model.authFactors;
        if (!all?.length) {
            return;
        }
        for (const iterator of all) {
            iterator.$deleted = true;
        }
        await this.userService.save(this.model);
        await this.init();
    }

    @Action({ onEvent: "enable-multi-factor", success: "Multi factor authentication enabled successfully."})
    async enableMultiFactor() {
        (this.model as any).multiFactor = true;
        await this.userService.save(this.model);
        await this.init();
    }

    @Action({ onEvent: "save-auth-factor", success: "Authenticator setup successfully."})
    async saveAuthFactor() {
        await this.userService.save(this.model);
        await this.init();
    }

}
