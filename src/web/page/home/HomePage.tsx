import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import TraceService from "../../../services/TraceService";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import InfiniteRepeater from "../../../common/InfiniteRepeater";

export default class HomePage extends ContentPage {

    @InjectProperty
    traceService: TraceService;

    traces = [];

    async init() {

        this.renderer = <div>
            <AtomRepeater
                items={this.traces}
                { ... InfiniteRepeater.pagedItems((start) =>
                        (c, e, cancelToken) => this.traceService.get({
                            start,
                            cancelToken
                        }))}
                itemRenderer={(item) => <div></div>}
                />
        </div>;

    }

}
