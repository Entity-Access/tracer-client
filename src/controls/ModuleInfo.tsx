import XNode from "@web-atoms/core/dist/core/XNode";

declare let moduleInfo: { ui: { package, version }, server: { package, version }};
export const ModuleInfo = typeof moduleInfo === "undefined"
    ? []
    : [
    <div title={`${moduleInfo.server.package}@${moduleInfo.server.version}`}>{moduleInfo.server.version}</div>,
    <div title={`${moduleInfo.ui.package}@${moduleInfo.ui.version}`}>{moduleInfo.ui.version}</div>
];
