import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import DropDown from "@web-atoms/web-controls/dist/basic/DropDown";
import EntityService from "../../services/EntityService";
import { ITraceName, TraceName } from "../../model/model";
import { BindableProperty } from "@web-atoms/core/dist/core/BindableProperty";

export default class NameDropDown extends DropDown {

    @InjectProperty
    entityService: EntityService;

    @BindableProperty
    public type: string;

    constructor(app, e) {
        super(app, e);
        this.runAfterInit(() => this.app.runAsync(() => this.init()));
    }

    async init() {
        const type = this.type;
        const names = await this.entityService.query(TraceName)
            .where({ type }, (p) => (x) => x.type === p.type)
            .orderBy((x) => x.name)
            .toArray();
        names.insert(0, TraceName.create({
            name: "Any",
            nameID: 0
        }));
        this.valuePath = (x: ITraceName) => x.nameID;
        this.labelPath = (x: ITraceName) => x.name;
        this.items = names;
    }

}
