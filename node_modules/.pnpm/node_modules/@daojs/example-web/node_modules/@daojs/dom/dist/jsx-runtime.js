export const Fragment = Symbol.for("dao.fragment");
export function jsx(type, props, key) {
    return { type, props, key };
}
export const jsxs = jsx;
export function jsxDEV(type, props, key) {
    return { type, props, key };
}
//# sourceMappingURL=jsx-runtime.js.map