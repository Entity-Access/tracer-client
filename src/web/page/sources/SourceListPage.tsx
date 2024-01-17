import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import { ContentPage } from "@web-atoms/web-controls/dist/mobile-app/MobileApp";
import TraceSourceService from "./services/TraceSourceService";

export default class SourceListPage extends ContentPage {

    @InjectProperty
    sourceService: TraceSourceService;

    async init() {
        this.renderer = <div>
            <AtomRepeater
                />
        </div>;
    }
}
