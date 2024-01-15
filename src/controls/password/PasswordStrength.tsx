import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { IPasswordValidation, Validators } from "../validators/Validators";

export default class PasswordStrength extends AtomControl {

    public password: string = "";

    public validation: IPasswordValidation = {
        hasMinimumLength: false,
        hasNumber: false,
        hasSymbol: false,
        isValid: false
    };

    protected preCreate(): void {
        this.render(<div data-layout="vertical-flex" validation={Bind.oneWay(() => Validators.checkPassword(this.password))}>

            <div data-layout="row">
                <i
                    data-color={Bind.oneWay(() => this.validation.hasMinimumLength ? "green" : "red")}
                    class={Bind.oneWay(() => this.validation.hasMinimumLength ? "fas fa-check" : "fas fa-times")}/>
                <span text="Password is at least 7 characters long."/>
            </div>

            <div data-layout="row">
                <i
                    data-color={Bind.oneWay(() => this.validation.hasNumber ? "green" : "red")}
                    class={Bind.oneWay(() => this.validation.hasNumber ? "fas fa-check" : "fas fa-times")}/>
                <span text="Password has a number."/>
            </div>

            <div data-layout="row">
                <i
                    data-color={Bind.oneWay(() => this.validation.hasSymbol ? "green" : "red")}
                    class={Bind.oneWay(() => this.validation.hasSymbol ? "fas fa-check" : "fas fa-times")}/>
                <span text="Password has a symbol."/>
            </div>
        </div>);
    }

}
