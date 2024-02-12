import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import TraceService from "../../../../services/TraceService";
import { ITrace } from "../../../../model/model";
import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";
import { UMD } from "@web-atoms/core/dist/core/types";
import XTerminal from "../../../../controls/terminal/XTerminal";

const css = styled.css `
    & .log-view {
        word-break: normal;
    }
`.installLocal();

export default class TraceDetailPage extends ContentPage<{ id: number }> {

    @InjectProperty
    private traceService: TraceService;

    public model: ITrace;

    async init() {

        this.element.className = css;

        this.model = await this.traceService.get(this.parameters.id);

        const model = JSON.parse(this.model.json);

        const json = JSON.stringify(model, void 0, 2);

        const { log, error } = model;

        const text = (log || error).split("\n").map((x) => x.trimEnd()).join("\r\n");

        this.headerRenderer = () => <div data-layout="row">
            <label text={this.model.host?.name}/>
        </div>;

        this.renderer = <div data-layout="vertical-flex-stretch-items">
            <XTerminal log={text} />
            <pre
                text={json}/>
        </div>;
    }


}