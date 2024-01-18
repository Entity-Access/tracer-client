import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import TraceSourceService from "./services/TraceSourceService";
import InfiniteRepeater from "../../../common/InfiniteRepeater";
import { ITraceSource, TraceSource } from "../../../model/model";
import Bind from "@web-atoms/core/dist/core/Bind";
import { AddIconTextButton } from "../../../controls/buttons/IconButton";
import Action from "@web-atoms/core/dist/view-model/Action";

export default class SourceListPage extends ContentPage {

    @InjectProperty
    sourceService: TraceSourceService;

    sources = [] as ITraceSource[];

    search = "";

    version = 1;

    async init() {
        this.renderer = <div>
            <AtomRepeater
                data-layout="data-grid"
                header={true}
                headerRenderer={() => <header>
                    <div data-layout="row">
                        <input value={Bind.twoWaysImmediate(() => this.search)}/>
                        <AddIconTextButton
                            data-click-event="add-source"
                            text="Add New"
                            />
                    </div>
                </header>}
                items={this.sources}
                { ... InfiniteRepeater.pagedItems((start) =>
                    (c, e, cancelToken) =>
                        this.sourceService.get({
                            search: this.search,
                            version: this.version,
                            start,
                            cancelToken
                        })
                    )}
                itemRenderer={(item: ITraceSource) => <div>
                    <label text={item.name}/>
                </div>}
                />
        </div>;
    }

    @Action({ onEvent: "add-source"})
    async addSource() {
        const name = prompt("Name");
        if (!name) {
            return;
        }

        this.sourceService.save(TraceSource.create({
            name
        }));

        this.version++;
    }
}
