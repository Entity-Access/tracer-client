import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import { BindError } from "@web-atoms/web-controls/dist/basic/Form";
import FormField from "@web-atoms/web-controls/dist/basic/FormField";
import IElement from "@web-atoms/web-controls/dist/basic/IElement";
import PasswordBox from "@web-atoms/web-controls/dist/basic/PasswordBox";

export interface IRequiredFormField<T = any> extends IElement {
    label: string;
    placeholder?: string;
    value: () => T;
    message?: (v: string, label: string) => string;
    isValid?: (v: string) => boolean;
    required?: boolean;
    valuePropertyName?: string;
}

export default function RequiredFormField<T = any> ({
    label,
    value,
    required = true,
    message,
    isValid,
    placeholder,
    valuePropertyName = "value",
    ... extra
}: IRequiredFormField<T>, node: XNode) {
    const a = (node.attributes ??= {});
    a[valuePropertyName] = Bind.twoWaysImmediate(value);
    if (placeholder) {
        a.placeholder = placeholder;
    }
    for (const key in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, key)) {
            const element = extra[key];
            a[key] ??= element;
        }
    }
    return <FormField
        required={required}
        label={label}
        error={BindError({ value, message, isValid})}>
            { node }
    </FormField>;
}

export function TextFormField( a: IRequiredFormField) {
    return <RequiredFormField { ... a}><input type="text"/></RequiredFormField>;
}

export function PasswordFormField(a: IRequiredFormField) {
    return <RequiredFormField { ... a}><PasswordBox value={Bind.twoWaysImmediate(a.value)}/></RequiredFormField>;
}
