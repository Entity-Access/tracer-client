
import { UMD } from "@web-atoms/core/dist/core/types";

import "@web-atoms/core/dist/core/AtomList";

import "./OverrideAppStyle";

export const ___UMD = UMD;

import styled from "@web-atoms/core/dist/style/styled";
import "@web-atoms/data-styles/data-styles";

// Add Font awesome
function addLinkTag(href, integrity?, rel = "stylesheet") {
    if (!document.head.querySelector(`[href="${href}"]`)) {
        const fa = document.createElement("link");
        fa.href = href;
        fa.crossOrigin = "anonymous";
        fa.as = "style";
        fa.rel = "preload";
        if (integrity) {
            fa.integrity = integrity;
        }
        fa.onload = () => {
            fa.onload = null;
            fa.rel = rel;
        };
        document.head.insertBefore(fa, document.head.firstElementChild);
    }
}

addLinkTag("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap");
addLinkTag("https://npm-git.azureedge.net/npm/package/@c8private/fa-icons@6.5.1/css/all.min.css");
addLinkTag("https://cdn.jsdelivr.net/npm/file-icon-vectors@1.0.0/dist/file-icon-vivid.min.css");

    styled.css `

:root {
    --primary-color: #294D4A;
    --accent-color: #ff6733;
    --accent2-color: #ff673375;
    --lighter-accent-color: #e6e6fa60;
    --light-accent-color: #f2e5fa;
    --accent-text-color: white;
    --background-color: #f1f1f160;  
    --window-background: #50505025;  
    --media-bg-color: #9F33FF0F;
    --font-size-small: 0.8125em;

    --hover-color: #b8b88b20;
    --hover-text-color: CanvasText;
    --selection-color: #b8b88b60;
    --selection-text-color: CanvasText;
    --spacing: 5px;
    --spacing-medium: 7px;
    --spacing-large: 10px;
}

html, body {
    margin:0;
}

* {
    scrollbar-width: 5px;
    scrollbar-color: var(--accent-color) white;

    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-track {
    background: white;
    }
    &::-webkit-scrollbar-thumb {
        background-color: white;
        border-radius: 20px;
        border: 3px solid var(--accent-color);
    }
}

body {
    font-family: trebuchet ms, "Source Sans Pro";
    font-size: 16px;
    justify-content: stretch;

    & * {
        font-family: trebuchet ms, "Source Sans Pro";
        box-sizing: border-box;
    }

    &::placeholder {
        font-size: smaller;
    }

    & ul {
        padding-inline-start: 15px;
    }

    & input[type=search] {
        border: none;
        outline: none;
        border-radius: 9999px;
        padding-right: 10px;
        padding-left: 25px;
        background: canvas url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat 5px center;
    }
}

`.withId("global-styles").withOrder("medium").installGlobal();