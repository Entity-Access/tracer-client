import { App } from "@web-atoms/core/dist/App";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import DISingleton from "@web-atoms/core/dist/di/DISingleton";
import { Inject } from "@web-atoms/core/dist/di/Inject";
import { StringHelper } from "@web-atoms/core/dist/core/StringHelper";
import styled from "@web-atoms/core/dist/style/styled";
import PopupWindow from "@web-atoms/core/dist/web/services/PopupWindow";
import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import XNode from "@web-atoms/core/dist/core/XNode";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";
import Bind from "@web-atoms/core/dist/core/Bind";
import PopupService from "@web-atoms/core/dist/web/services/PopupService";

export const acceptDocumentAndMedia = ".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, video/*, application/pdf, .pdf, .txt, audio/*, image/*, .csv, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain, text/html";

export interface IFileRequestOptions {
    accept?: string;
    multiple?: boolean;
}

export interface IUploadedFile {
    file: File;
    appFileID: number;
    inline?: boolean;
    url: string;
}

export type UploadedFiles = CustomEvent<{ files: IUploadedFile[], extra: any}>;

    styled.css `
        display: inline-grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto 1fr auto;

        & > [data-element=preview] {
            grid-row: 1 / span 2;
            grid-column: 1;
        }

        & > [data-element=file-name] {
            grid-row: 1;
            grid-column: 2;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        & > [data-element=progress] {
            grid-row: 2;
            grid-column: 2 / span 2;
            width: 100%;
        }

        & > [data-element=delete] {
            grid-row: 1;
            grid-column: 3;
        }
    `.installGlobal("[data-attachment-file]");

export interface IFileUpload {
    name: string;
    progress?: number;
    promise?: Promise<{ appFileID }>
}

@DISingleton()
export default class LocalFileService {

    @Inject
    private app: App;

    constructor() {
        document.body.addEventListener("uploadRequested", (ce: CustomEvent) => {
            const { target, detail: { files, extra, uploadEvent } } = ce;
            ce.preventDefault();
            this.app.runAsync(async () => {
                const detail = await FileUploadWindow.showModal<IUploadedFile>({ parameters: { files, extra }});
                target.dispatchEvent(
                    new CustomEvent( StringHelper.fromHyphenToCamel(uploadEvent),
                        { detail, bubbles: true }));
            });
        });
    }

    async uploadWithProgress(files: File[], extra?) {
        const detail = await FileUploadWindow.showModal<{ files: IUploadedFile[]}>({ parameters: { files, extra }});
        return detail.files;
    }

    async sha256(blob: Blob) {
        const msgBuffer = await blob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // convert bytes to hex string
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    async uploadFile(file: File, extra: any, ct?: CancelToken, progress?: (n) => void) {
        const sha256 = await this.sha256(file);
        return new Promise<IUploadedFile>((resolve, reject) => {
            const body = new FormData();
            body.append(file.name, file, file.name);
            body.append("sha256", sha256);
            const xhr = new XMLHttpRequest();
                const onError = () => {
                reject(new Error(xhr.responseText || "Error"));
            };
            ct?.registerForCancel(() => xhr.abort());
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    progress?.(event.loaded / event.total);
                }
            });
            xhr.upload.addEventListener("timeout", onError);
            xhr.upload.addEventListener("error", onError);
            xhr.upload.addEventListener("abort", onError);
            xhr.addEventListener("timeout", onError);
            xhr.addEventListener("abort", onError);
            xhr.addEventListener("error", onError);
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    progress?.(event.loaded / event.total);
                }
            });
            xhr.addEventListener("load", () => {
                if(xhr.status <= 300) {
                    const r = { ... JSON.parse(xhr.responseText), file};
                    resolve(r);
                }
            });

            let postUrl = "/api/upload";
            const s = new URLSearchParams();

            if (extra) {
                if (typeof extra === "string") {
                    extra = JSON.parse(extra);
                }
                for (const key in extra) {
                    if (Object.prototype.hasOwnProperty.call(extra, key)) {
                        const element = extra[key];
                        if (element) {
                            s.append(key, element);
                        }
                    }
                }
            }

            if (file.webkitRelativePath) {
                const folders = file.webkitRelativePath.split("/");
                folders.pop();
                if (folders.length) {
                    const folder = folders.join("/");
                    s.append("folder", folder);
                }
            }

            postUrl += "?" + s.toString();

            xhr.open("POST", postUrl, true);
            xhr.send(body);
        });
    }

    async upload(files: File[], extra: any, ct?: CancelToken) {
        return files.map((file) => {
            const uploadFile: IFileUpload = {
                name: file.name
            };
            uploadFile.promise = this.uploadFile(file, extra, ct, (n) => uploadFile.progress = n);
            return uploadFile;
        });
    }

}


class FileUploadWindow extends PopupWindow {
    public parameters: { files?: File[], uploadEvent?: string, extra?: any } = {};

    @InjectProperty
    private localFileService: LocalFileService;

    private files: IFileUpload[];

    protected async init() {
        this.title = "Uploading...";
        this.closeWarning = "Are you sure you want to cancel the upload?";

        this.bindEvent(window as any, "backButton", async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation?.();
            e.stopPropagation();
            await this.requestCancel();
        }, null, { capture: true });

        this.files = await this.localFileService.upload(this.parameters.files, this.parameters.extra, this.cancelToken);

        this.render(<div>
            <AtomRepeater
                items={this.files}
                itemRenderer={(file) =>
                    <div data-attachment-file="file">
                        <div data-element="file-name" text={file.name}/>
                        <progress
                            min={0}
                            max={100}
                            value={Bind.source(file, (x) => x.source.progress)}/>
                    </div>}
                />
        </div>);
        try {

            const ct = new CancelToken();

            this.registerDisposable({
                dispose: () => {
                    ct.cancel();
                }
            });

            const tasks = this.files.map((x) => x.promise);
            const files = await Promise.all(tasks);
            const extra = this.parameters.extra;
            this.close({ files, extra });
        } catch (error) {
            if (CancelToken.isCancelled(error)) {
                this.cancel(error);
                return;
            }
            await PopupService.alert({ message: error });
            this.cancel(error);
        }
    }

}

