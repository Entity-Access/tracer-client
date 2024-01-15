import styled from "@web-atoms/core/dist/style/styled";

const css = styled.css `

    position: absolute;
    left: 0;
    top: 0;
    height: 0;
    right: 0;
    z-index: 100000;
    background-color: canvas;
    display: none;
    overflow: hidden;

    & > .progress-bar {
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--accent2-color);
  
        & > .progress-bar-value {
            display: none;
            width: 100%;
            height: 100%;
            background-color: var(--accent-color);
            transform-origin: 0% 50%;
        }
    }

    &[data-show] {
        display: block;
        height: 3px;

        & > .progress-bar {
            display: block;
            & > .progress-bar-value {
                display: block;
                animation: progressBarInfiniteAnimation 2s infinite linear;
            }
        }
    }


    @keyframes progressBarInfiniteAnimation {
        0% {
            transform:  translateX(0) scaleX(0);
        }
        40% {
            transform:  translateX(0) scaleX(0.4);
        }
        100% {
            transform:  translateX(100%) scaleX(0.5);
        }
    }

`.installLocal();

let container: HTMLDivElement;

let stack = 0;

export default class BusyProgress {

    public static create() {

        if(!container) {
            container = document.createElement("div");
            container.className = css;
            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";
            container.appendChild(progressBar);
            const progressBarValue = document.createElement("div");
            progressBarValue.className = "progress-bar-value";
            progressBar.appendChild(progressBarValue);

            document.body.appendChild(container);
        }

        stack++;
        if (stack === 1) {
            container.setAttribute("data-show", "true");
        }
        return {
            dispose() {
                stack--;
                if (stack <= 0) {
                    container.removeAttribute("data-show");
                }
            }
        };
    }

}
