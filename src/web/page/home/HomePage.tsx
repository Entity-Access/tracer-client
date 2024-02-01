import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import TraceService from "../../../services/TraceService";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import InfiniteRepeater from "../../../common/InfiniteRepeater";
import { LiveTraceSocket } from "../../../services/socket/sockets";
import { ITrace } from "../../../model/model";
import { DateFormats } from "../../../common/date/DateFormats";
import Action from "@web-atoms/core/dist/view-model/Action";
import PageNavigator from "@web-atoms/web-controls/dist/PageNavigator";
import TraceDetailPage from "../traces/detail/TraceDetailPage";
import styled from "@web-atoms/core/dist/style/styled";
import Select from "@web-atoms/web-controls/dist/basic/Select";
import Bind from "@web-atoms/core/dist/core/Bind";

const css = styled.css `
    & .trace {
        & .log {
            display: inline-block;
            max-height: 150px;
            text-overflow: ellipsis;
            white-space: break-spaces;
            overflow: hidden;
        }
    }
`.installLocal();

const types = [
    { label: "All", value: "" },
    { label: "Error", value: "error"}
];

export default class HomePage extends ContentPage {

    @InjectProperty
    traceService: TraceService;

    @InjectProperty
    liveTrace: LiveTraceSocket;

    traces = [];

    version = 1;

    type = "";

    async init() {

        this.registerDisposable(await this.liveTrace.join("*", {
            send: (sourceID, { traceID }) => {
                this.version++;
            },
        }));

        this.element.className = css;

        this.headerRenderer = () => <div data-layout="row">
            <Select items={types} value={Bind.twoWaysImmediate(() => this.type)}/>
            <button event-click={() => this.version++} text="Refresh"/>
        </div>;

        this.renderer = <div>
            <AtomRepeater
                items={this.traces}
                data-layout="data-grid"
                { ... InfiniteRepeater.pagedItems((start) =>
                        (c, e, cancelToken) => this.traceService.list({
                            start,
                            cancelToken,
                            type: this.type,
                            version: this.version
                        }))}
                itemRenderer={(item: ITrace) => {
                    const { log, error, host } = JSON.parse(item.json);
                    return <div class="trace" data-click-event="open-trace">
                        <label
                            data-color={ error ? "red" : "none" }
                            text={host || "None"}/>
                        <label
                            class="log"
                            text={log || error}/>
                        <label
                            data-wrap="none"
                            text={DateFormats.relative.short(item.dateCreated)}/>
                    </div>;
                }}
                />
        </div>;

    }

    @Action({ onEvent: "open-trace"})
    openTrace({ traceID: id }: ITrace) {
        PageNavigator.pushPage(TraceDetailPage, { id });
    }

}
