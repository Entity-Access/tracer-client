import { UMD } from "@web-atoms/core/dist/core/types";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";

let xterm: any;

const loadTerminal = async () => {
    const [{Terminal}, {WebLinksAddon}, {FitAddon }] = await (xterm ??= Promise.all([
        UMD.import("https://cdn.jsdelivr.net/npm/@xterm/xterm@5.4.0-beta.1/lib/xterm.js") as any,
        UMD.import("https://cdn.jsdelivr.net/npm/@xterm/addon-web-links@0.10.0-beta.1/lib/addon-web-links.min.js") as any,
        UMD.import("https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.9.0-beta.1/lib/addon-fit.min.js") as any,
    ]));
    return { Terminal, WebLinksAddon, FitAddon };
};

const css = document.createElement("link");
css.rel = "stylesheet";
css.href = "https://cdn.jsdelivr.net/npm/@xterm/xterm@5.4.0-beta.1/css/xterm.css";
document.body.append(css);

export default class XTerminal extends AtomControl {

    private terminal: any;

    @BindableProperty
    public log: string;

    constructor(app, e) {
        super(app, e);
        this.runAfterInit(() => this.app.runAsync(() => this.init()));
    }

    async init() {
        const { Terminal, WebLinksAddon, FitAddon  } = await loadTerminal();
        this.terminal = new Terminal();
        const fitAddon = new FitAddon();
        this.terminal.loadAddon(new WebLinksAddon());
        this.terminal.loadAddon(fitAddon);
        this.terminal.open(this.element);
        fitAddon.fit(this.terminal);
        this.update();
    }

    onPropertyChanged(name: string): void {
        switch(name) {
            case "log":
                this.update();
            break;
        }
    }

    update() {
        if (this.terminal && this.log) {
            this.terminal.write(this.log);
        }
    }

}
