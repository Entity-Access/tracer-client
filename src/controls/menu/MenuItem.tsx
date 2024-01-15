import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

export default function MenuItem ({
    label,
    icon = void 0 as string,
    click = undefined,
    title = label,
    description = void 0 as string,
    href = "",
    commandLink = "",
    target = undefined as string,
    ... a
}) {
    return href || commandLink
    ? <a data-layout="menu-item"
        title={title}
        data-click-event={ commandLink ? "route" : void 0}
        href={href || commandLink}
        target={target}
        event-click={click}
        { ... a}>
        { icon && <i class={icon}/> }
        <span text={label}/>
        { description && <small text={description}/>}
    </a>
    : <div
        title={title}
        data-layout="menu-item"
        event-click={click}
        { ... a}>
        { icon && <i class={icon}/> }
        <span text={label}/>
        { description && <small text={description}/>}
    </div>;
}