import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import styled from "@web-atoms/core/dist/style/styled";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

    styled.css `
    i[data-copy-icon] {
        padding: 5px;
        cursor: pointer; 
    }
`.withId("data-copy-icon").installGlobal();

document.body.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const text = target.dataset.copyIcon?.trim();
    if (!text) {
        return;
    }
    navigator.clipboard.writeText(text).then((x) => {

        const control = AtomControl.from(target);
        const ns = control.app.resolve(NavigationService);
        return ns.notify(<div>
            <p text={text}/>
            <p>Copied to clipboard successfully</p>
        </div>);
    }).catch((error) => console.error(error));
});

export default function CopyIcon({ text }) {
    return <i
        class="fa-solid fa-paste"
        data-copy-icon={text}
        title={`Copy ${text}`}/>;
}