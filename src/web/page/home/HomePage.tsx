import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import TraceService from "../../../services/TraceService";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import InfiniteRepeater from "../../../common/InfiniteRepeater";
import { LiveTraceSocket } from "../../../services/socket/sockets";
import { ITrace } from "../../../model/model";
import { DateFormats } from "../../../common/date/DateFormats";

export default class HomePage extends ContentPage {

    @InjectProperty
    traceService: TraceService;

    @InjectProperty
    liveTrace: LiveTraceSocket;

    traces = [];

    version = 1;

    async init() {

        this.registerDisposable(await this.liveTrace.join("*", {
            send: (sourceID, { traceID }) => {
                this.version++;
            },
        }))

        this.renderer = <div>
            <AtomRepeater
                items={this.traces}
                data-layout="data-grid"
                { ... InfiniteRepeater.pagedItems((start) =>
                        (c, e, cancelToken) => this.traceService.get({
                            start,
                            cancelToken
                        }))}
                itemRenderer={(item: ITrace) => <div>
                    <label text={item.source.name}/>
                    <label text={DateFormats.relative.short(item.dateCreated)}/>
                </div>}
                />
        </div>;

    }

}
