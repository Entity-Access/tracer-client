/* eslint-disable no-console */
import { AtomDisposableList } from "@web-atoms/core/dist/core/AtomDisposableList";
import { UMD } from "@web-atoms/core/dist/core/types";
import DISingleton from "@web-atoms/core/dist/di/DISingleton";

type IEventHandler = (... a: any[]) => any;

let io;

const cache = new Map<string, SocketNamespace>();

const of = async (name: string) => {
    io ??= (await UMD.import("https://cdn.jsdelivr.net/npm/socket.io-client@4.6.0/dist/socket.io.min.js") as any).io;
    const value = io(name,{
        transports: ['websocket']
    });
    await new Promise((resolve, reject) => {
        value.on("connect", resolve);
    });
    return value;
};

class SocketNamespace {

    static for(ns: string) {
        let sn = cache.get(ns);
        if (!sn) {
            sn = new SocketNamespace(ns);
            cache.set(ns, sn);
        }
        return sn;
    }

    private rooms: Map<string,Set<IEventHandler>> = new Map();

    private socket;

    constructor(private ns: string) {

    }

    async connect(roomName: string, events: any) {
        this.socket ??= await this.init();
        let room = this.rooms.get(roomName);
        if (!room) {
            room = new Set();
            this.rooms.set(roomName, room);
            this.socket.emit("join", roomName);
        }
        const disposables = new AtomDisposableList();
        for (const key in events) {
            if (Object.prototype.hasOwnProperty.call(events, key)) {
                const element = events[key] as IEventHandler;
                const handler = (... a: any) => element(... a)?.catch(console.error);
                room.add(handler);
                this.socket.on(key, handler);
                disposables.add(() => {
                    this.socket.off(key, handler);
                    room.delete(handler);
                });
            }
        }
        disposables.add(() => this.clear(roomName));
        return disposables;
    }

    clear(roomName: string): void {
        const room = this.rooms.get(roomName);
        if (room.size === 0) {
            this.rooms.delete(roomName);
            this.socket.emit("leave", roomName);
        }
    }

    private init(): Promise<any> {
        const init = async () => {
            const ns = await of("/" + this.ns);
            return ns;
        };
        const value = init();
        Object.defineProperty(this, "init", { value: () => value });
        return value;
    }

}


@DISingleton()
export class LiveTraceSocket {

    async join(room: string, events: { send(sourceID, { traceID }); }) {
        const disposables = new AtomDisposableList();
        const ns = SocketNamespace.for("live-trace");
        ns.connect(room, events).then((v) => disposables.add(v), console.error);
        return disposables;
    }

}