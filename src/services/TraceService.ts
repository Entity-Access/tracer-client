import DISingleton from "@web-atoms/core/dist/di/DISingleton";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import EntityService from "./EntityService";
import { Trace } from "../model/model";

@DISingleton()
export default class TraceService {

    @Inject
    private entityService: EntityService;

    get({
        search = "",
        start = 0,
        size = 100,
        cancelToken
    }) {
        let q = this.entityService.query(Trace);
        if (search) {
            
        }
        return q.include((x) => [
            x.host,
            x.app,
            x.source,
            x.server,
            x.session,
            x.user
        ]).orderByDescending((x) => x.traceID).toPagedList({
            start,
            size,
            cancelToken
        });
    }

}