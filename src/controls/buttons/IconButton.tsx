import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";
import IElement from "@web-atoms/web-controls/dist/basic/IElement";

    styled.css `
    `.installGlobal("[data-layout=icon-button]");

export interface IButtonOptions extends IElement {
    text?: string;
    icon?: string;
}

const createButton = ({
    text: defaultText = void 0,
    icon: defaultIcon = void 0,
    layout: defaultLayout = ""
}: IButtonOptions) =>
    ({
        text = defaultText,
        icon = defaultIcon,
        layout = defaultLayout || (icon ? "icon-button" : "button"),
        ... a
    }: IButtonOptions) => {
    a["data-layout"] = layout;
    if (text && icon) {
        return <button { ... a}>
            <i class={icon}/>
            <span text={text}/>
        </button>;
    }
    if (icon) {
        return <button { ... a} class={icon}/>;
    }
    return <button { ... a} text={text}/>;
};

export const IconButton = createButton({});

export const AddIconButton = createButton({ icon: "fas fa-plus", layout: "go-button" });
export const AddIconTextButton = createButton({ text : "Add", icon: "fas fa-plus", layout: "go-icon-button" });

export const ArchiveIconButton = createButton({ icon: "fas fa-trash-can", layout: "warning-button" });
export const ArchiveIconTextButton = createButton({ text : "Archive", icon: "fas fa-trash-can", layout: "warning-icon-button" });

export const CopyIconButton = createButton({ icon: "fas fa-copy", layout: "button" });
export const CopyIconTextButton = createButton({ text : "Open", icon: "fas fa-copy", layout: "icon-button" });

export const SetupFolderIconButton = createButton({ icon: "fas fa-gear", layout: "button" });
export const SetupFolderTextButton = createButton({ text : "Open", icon: "fas fa-gear", layout: "icon-button" });

export const DeleteIconButton = createButton({ icon: "fas fa-trash-can", layout: "reject-button" });
export const DeleteIconTextButton = createButton({ text : "Delete", icon: "fas fa-trash-can", layout: "reject-icon-button" });

export const EmailIconButton = createButton({ icon: "fas fa-envelope", layout: "go-button" });
export const EmailIconTextButton = createButton({ text : "Email", icon: "fas fa-envelope", layout: "go-icon-button" });


export const SaveIconButton = createButton({ icon: "fas fa-floppy-disk", layout: "accept-button" });
export const SaveIconTextButton = createButton({ text : "Save", icon: "fas fa-floppy-disk", layout: "accept-icon-button" });

export const EditIconButton = createButton({ icon: "fas fa-edit", layout: "button"});
export const EditIconTextButton = createButton({ text : "Edit", icon: "fas fa-edit", layout: "icon-button"});

export const UploadIconButton = createButton({ icon: "fas fa-upload", layout: "go-button" });
export const UploadIconTextButton = createButton({ text : "Upload", icon: "fas fa-upload", layout: "go-icon-button" });
