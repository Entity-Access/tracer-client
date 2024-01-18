import DISingleton from "@web-atoms/core/dist/di/DISingleton";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import EntityService from "../../../../services/EntityService";
import { ITraceSource, TraceSource } from "../../../../model/model";

@DISingleton()
export default class TraceSourceService {

    @Inject
    private entityService: EntityService;

    async get({
        search = "",
        start,
        size = 200,
        version = 1,
        cancelToken
    }) {
        let q = this.entityService.query(TraceSource);
        return q.include((x) => x.sourceUsers).toPagedList({
            start,
            size,
            cancelToken
        });
    }

    async save(source: ITraceSource) {
        const cloner = this.entityService.cloner(source)
            .include((x) => x.sourceUsers)
            .include((x) => x.keySources)
            .copy;
        await this.entityService.save(cloner);
        return source;
    }

}
