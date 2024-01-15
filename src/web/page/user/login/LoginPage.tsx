import XNode from "@web-atoms/core/dist/core/XNode";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import Form from "@web-atoms/web-controls/dist/basic/Form";
import FormField from "@web-atoms/web-controls/dist/basic/FormField";
import { ILoginSession, LoginSession } from "../../../../model/model";
import Bind from "@web-atoms/core/dist/core/Bind";
import PasswordBox from "@web-atoms/web-controls/dist/basic/PasswordBox";
import Action from "@web-atoms/core/dist/view-model/Action";
import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import LoginService from "../../../../services/LoginService";
import { PasswordFormField } from "../../../controls/form/RequiredFormField";
import sleep from "@web-atoms/core/dist/core/sleep";
import PasswordStrength from "../../../controls/password/PasswordStrength";
import { Validators } from "../../../validators/Validators";
import ToggleButtonBar from "@web-atoms/web-controls/dist/basic/ToggleButtonBar";
import { SaveIconTextButton } from "../../../controls/buttons/IconButton";

const authTypes = [{
    label: "Authenticator (TOTP)",
    value: "totp"
},
{
    label: "One Time Password",
    value: "one-time"
}
];

export default class LoginPage extends ContentPage {

    @InjectProperty
    private userService: LoginService;

    private model: ILoginSession;

    private password?: string = "";

    private authType = "totp";

    async init() {
        this.model = LoginSession.create({});
        this.model.userName = "";
        this.model.checkPassword = "";
        this.model.timeToken = "";
        this.model.oneTimePassword = "";
        this.render(<div>
            <div data-layout="center-all">
                <Form>
                    <FormField label="Username">
                        <input value={Bind.twoWaysImmediate(() => this.model.userName)}/>
                    </FormField>
                    <FormField label="Password">
                        <PasswordBox
                            value={Bind.twoWaysImmediate(() => this.model.checkPassword)}
                            />
                    </FormField>
                    <div>
                        <button
                            data-layout="accent-button"
                            data-submit-event="login"
                            text="Login"
                            />
                    </div>
                </Form>
            </div>
        </div>);
    }

    @Action({ onEvent: "login" })
    async login() {
        const status = await this.userService.login(this.model);

        if (!status) {
            return;
        }

        if (status === "change-password") {
            await this.showChangePassword();
            return;
        }

        this.renderer = <div data-layout="center-all">
            <Form>
                <FormField label="Enter">
                    <ToggleButtonBar items={authTypes} value={Bind.twoWays(() => this.authType)}/>
                </FormField>
                <FormField
                    label="Code"
                    style-display={Bind.oneWay(() => this.authType === "totp")}>
                    <input type="tel" value={Bind.twoWaysImmediate(() => this.model.timeToken)}/>
                </FormField>
                <FormField
                    label="One Time Password"
                    style-display={Bind.oneWay(() => this.authType !== "totp")}>
                    <input type="tel" value={Bind.twoWaysImmediate(() => this.model.oneTimePassword)}/>
                </FormField>
                <div data-layout="command-row">
                    <SaveIconTextButton
                        event-click={() => this.login()}
                        text="Go"
                        />
                </div>
            </Form>
        </div>;

    }

    async showChangePassword() {
        this.model.newPassword = "";

        this.renderer = <div>
            <div data-layout="center-all">
                <Form>
                    <div>Update your password, your one time password is expired.</div>
                    <FormField
                        label="Password"
                        required={true}
                        error={Bind.oneWay(() => Validators.isValidPassword(this.password)
                            ? ""
                            : "Password must contain one symbol, one number and should be minimum 7 characters" )}>
                        <PasswordBox
                            value={Bind.twoWaysImmediate(() => this.password)}
                            />
                    </FormField>
                    <PasswordStrength
                        password={Bind.oneWay(() => this.password)}
                        />
                    <FormField
                        label="Password Again"
                        required={true}
                        error={Bind.oneWay(() => this.model.newPassword !== this.password ? "Passwords do not match" : "")}>
                        <PasswordBox
                            value={Bind.twoWaysImmediate(() => this.model.newPassword)}
                            />
                    </FormField>
                    <div data-layout="command-row">
                        <button
                            data-submit-event="login"
                            text="Change Password & Login"/>
                    </div>
                </Form>
            </div>
        </div>;

    }

}
