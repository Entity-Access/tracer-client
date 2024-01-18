import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import TraceSourceService from "./services/TraceSourceService";
import InfiniteRepeater from "../../../common/InfiniteRepeater";
import { ITraceSource, TraceSource } from "../../../model/model";
import Bind from "@web-atoms/core/dist/core/Bind";
import { AddIconTextButton, DeleteIconTextButton } from "../../../controls/buttons/IconButton";
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
                    { item.keySources?.length
                        && <label
                            data-click-event="show-keys"
                            data-cursor="pointer"
                            text={`Keys: ${item.keySources?.length}`}/> }
                    { item.keySources?.length && <div>
                        <div data-layout="vertical-flex-center-items">
                            { ... item.keySources.map((s) => <input
                                readOnly={true}
                                style-width="40ch"
                                value={s.key} />)}
                        </div>
                    </div> }
                    <br/>
                    <DeleteIconTextButton
                        data-click-event="delete-source"
                        />
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

        await this.sourceService.save(TraceSource.create({
            name
        }));

        this.version++;
    }

    @Action({
        onEvent: "delete-source",
        confirm: "Are you sure you want to delete this source?"
    })
    async deleteSource(source: ITraceSource) {
        await this.sourceService.delete(source);
        this.version++;
    }

}
