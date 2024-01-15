import DITransient from "@web-atoms/core/dist/di/DITransient";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import EntityService from "./EntityService";
import FetchBuilder from "@web-atoms/core/dist/services/FetchBuilder";
import { LoginSession } from "../model/model";

@DITransient()
export default class WebPushService {

    @Inject
    private entityService: EntityService;

    async register() {
        try {
                    // ask for push...
            if (!("serviceWorker" in navigator)) {
                return;
            }

            const r = await navigator.serviceWorker.ready;
            let s = await r.pushManager.getSubscription();
            if (!s) {
                s = await this.createRegistration(r);
                if (!s) {
                    return;
                }
            }
            await this.updateRegistration(s);
        } catch (error) {
            console.error(error);
        }
    }

    async createRegistration(r: ServiceWorkerRegistration) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            return;
        }

        const { webPush: { publicKey }} = await FetchBuilder.get("/api/push/keys")
            .responseAsJson<any>();

        const s = await r.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey
        });
        return s;
    }
    async updateRegistration(s: PushSubscription) {
        const endpoint = s.endpoint;
        const expirationTime = s.expirationTime;

        const toHex = (a: ArrayBuffer) => {
            let n = "";
            const u = new Uint8Array(a);
            for (const iterator of u) {
                n += iterator.toString(16).padStart(2, '0');
            }
            return n;
        };

        const p256dh = toHex(s.getKey("p256dh"));
        const auth = toHex(s.getKey("auth"));
        const json = {
            endpoint,
            expirationTime,
            keys: {
                p256dh,
                auth
            }
        };
        const session = await this.entityService.query(LoginSession, "currentUser").firstOrDefault();
        session.deviceToken = JSON.stringify(json);
        session.deviceTokenType = "WebPush";
        const cloner = this.entityService.cloner(session);
        await this.entityService.save(cloner.copy);
    }
}