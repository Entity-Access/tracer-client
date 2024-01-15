import styled from "@web-atoms/core/dist/style/styled";

    styled.css `

    div[data-desktop-app=desktop-app] {
        width: 100%;
    }

    /* div[data-base-page=base-page] {
        & > [data-page-element=title] {
            overflow-y: visible;
        }
    } */

`.withId("default-app-style").withOrder("medium").installGlobal();