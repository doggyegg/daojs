declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "@daojs/dom/jsx-runtime" {
  export { Fragment, jsx, jsxs, jsxDEV } from "./jsx-runtime";
}

declare module "@daojs/dom/jsx-dev-runtime" {
  export { Fragment, jsx, jsxs, jsxDEV } from "./jsx-runtime";
}
