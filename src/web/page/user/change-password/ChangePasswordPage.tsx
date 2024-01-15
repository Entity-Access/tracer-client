import { PopupWindowPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import { IUser } from "../../../../model/model";
import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import UserService from "../services/UserService";
import XNode from "@web-atoms/core/dist/core/XNode";
import Form from "@web-atoms/web-controls/dist/basic/Form";
import { PasswordFormField } from "../../../controls/form/RequiredFormField";
import Bind from "@web-atoms/core/dist/core/Bind";
import PasswordStrength from "../../../controls/password/PasswordStrength";
import FormField from "@web-atoms/web-controls/dist/basic/FormField";
import PasswordBox from "@web-atoms/web-controls/dist/basic/PasswordBox";
import { Validators } from "../../../validators/Validators";
import { SaveIconTextButton } from "../../../controls/buttons/IconButton";
import Action from "@web-atoms/core/dist/view-model/Action";

export default class ChangePasswordPage extends PopupWindowPage {

    model: IUser;

    @InjectProperty
    private userService: UserService;

    private password: string = "";

    async init() {

        this.model = await this.userService.getCurrent();

        this.title = "Change Password";

        this.model.changePassword = {
            oldPassword: "",
            newPassword: "",
            forceChangePasswordOnLogin: false
        };

        this.renderer = <div>
            <Form>
                <PasswordFormField
                    label="Current Password"
                    value={() => this.model.changePassword.oldPassword}
                    />
                <FormField
                    label="Password"
                    required={true}
                    error={Bind.oneWay(() => Validators.isValidPassword(this.password) ? "" : "Password is invalid" )}
                    >
                    <PasswordBox
                        value={Bind.twoWaysImmediate(() => this.password)}
                        />
                </FormField>
                <PasswordStrength
                    password={Bind.oneWay(() => this.password)}
                    />
                <FormField
                    label="Password again"
                    required={true}
                    error={Bind.oneWay(() => this.password !== this.model.changePassword.newPassword ? "Passwords do not match" : "")}>
                    <PasswordBox
                        value={Bind.twoWaysImmediate(() => this.model.changePassword.newPassword)}
                        />
                </FormField>

                <div data-layout="command-row">
                    <SaveIconTextButton
                        data-submit-event="save-user"
                        text="Change"
                        />
                </div>
            </Form>
        </div>;

    }

    @Action({ onEvent: "save-user", success: "Password changed successfully.", close: true})
    async saveUser() {
        await this.userService.save(this.model);
    }

}
