import Bind from "@web-atoms/core/dist/core/Bind";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomRepeater from "@web-atoms/web-controls/dist/basic/AtomRepeater";

const loadMoreSet = Symbol("loadMoreSet");

    styled.css `

    margin: 10px;
    padding: 10px;
    & > span {
        background-color: lightgray;
        border-radius: 10px;
        padding: 3px;
        padding-left: 10px;
        padding-right: 10px;
        border: solid 1px gray;
    }

`.installGlobal("[data-load-more=load-more]");

export interface IAnyPagedItems {
    items: any[];
    total: number;
}

export interface IInfiniteRepeater extends AtomRepeater {
    pagedItems: IAnyPagedItems;
    [loadMoreSet]: CancelToken;
    start: number;
}

const pagedItemsSetter = AtomControl.registerProperty("paged-items", "paged-items",
(control: IInfiniteRepeater, element, value) => {
    if (value && value.items) {
        let cancelToken = control[loadMoreSet];
        control.footerRenderer ??= () => <div data-load-more="load-more" data-click-event="load-more-items"><span text="Load more ... "/></div>;
        control.headerRenderer ??= () => <div class="scroll-header" style-height="1px" style-width="100%"/>;
        if (!cancelToken) {
            control[loadMoreSet] = cancelToken = new CancelToken();
            control.bindEvent(control.element, "loadMoreItems", (e: any) => {
                const ce = new CustomEvent("moreItems", {
                    detail: {
                        pagedItems: control.pagedItems,
                        cancelToken
                    },
                    bubbles: false
                });
                control.element.dispatchEvent(ce);
            });
        } else {
            cancelToken.cancel();
            control[loadMoreSet] = cancelToken = new CancelToken();
        }
        const items = control.items;
        if (items && Array.isArray(items)) {
            items.clear();
            items.addAll(value.items);
        } else {
            control.items = value.items;
        }

        setTimeout(() => {
            const ce = control.element?.firstElementChild as HTMLElement;
            ce?.scrollIntoView();
        }, 100);

        control.footer = value.total && value.items && value.items.length < value.total;
        (control as any).pagedItems = value;
    }
});

export type RepeaterLoader = (start: number) => (control: AtomControl, element: HTMLElement, cancelToken: CancelToken) => any;

const scrollToBottom = ({ target, detail: { type, index}}) => {
    if (!(type === "add" && index === 0) && type !== "reset") {
        return;
    }
    setTimeout(() => {
        const e = target.firstElementChild as HTMLElement;
        console.log(e);
        e?.scrollIntoView(true);
    }, 1);
};

export default class InfiniteRepeater {

    public static pagedItems = (start: RepeaterLoader) => {
        const setter = start(0);
        const setters = pagedItemsSetter(Bind.oneWayAsync(setter)) as any;
        setters["event-more-items"] = Bind.event(async (s: any, e) => {
            const st = s.items?.length ?? 0;
            if (!st) {
                return;
            }
            const cancelToken = s[loadMoreSet];
            const loader = start(st);
            const results = await loader(s, e.target as any, cancelToken);
            s.items.addAll(results.items);
            s.footer = results.items.length > 0;
        });
        // setters["event-items-updated"] = scrollToBottom;
        return setters;
    };

}
