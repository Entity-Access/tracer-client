import DISingleton from "@web-atoms/core/dist/di/DISingleton";
import BaseEntityService from "@web-atoms/entity/dist/services/BaseEntityService";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import { App } from "@web-atoms/core/dist/App";
import { IHttpRequest } from "@web-atoms/entity/dist/services/HttpSession";
import BusyProgress from "./BusyProgress";
import { QueryProcessor } from "@web-atoms/entity/dist/services/QueryProcessor";


@DISingleton()
export default class EntityService extends BaseEntityService {

    public queryProcessor: QueryProcessor = "JavaScript";

    @Inject
    private app: App;

    protected createBusyIndicator(options: IHttpRequest) {
        if (options.hideActivityIndicator) {
            return;
        }
        return BusyProgress.create();
    }

}
