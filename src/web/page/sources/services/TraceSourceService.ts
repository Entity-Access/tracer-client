import DISingleton from "@web-atoms/core/dist/di/DISingleton";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import EntityService from "../../../../services/EntityService";
import { ITraceSource, Trace, TraceSource } from "../../../../model/model";

@DISingleton()
export default class TraceSourceService {

    @Inject
    private entityService: EntityService;

    async get({
        search = "",
        id = 0,
        start,
        size = 200,
        version = 1,
        cancelToken
    }) {
        let q = this.entityService.query(TraceSource);
        if (id) {
            q = q.where({ id }, (p) => (x) => x.sourceID === p.id);
        }
        return q.include((x) => [x.sourceUsers, x.keySources]).toPagedList({
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

    async delete(source: ITraceSource) {
        // check if there are any traces...
        const { sourceID } = source;
        const t = await this.entityService.query(Trace)
            .where({ sourceID }, (p) => (x) => x.sourceID === p.sourceID)
            .firstOrDefault();

        if (t) {
            throw new Error("Cannot delete sources with existing traces.");
        }

        source.$deleted = true;
        await this.entityService.save(this.entityService.cloner(source).copy);
    }

}
