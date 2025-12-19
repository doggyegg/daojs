import type { VNode, Props } from "./types";

export const Fragment = Symbol.for("dao.fragment");

export function jsx(type: any, props: Props | null, key?: any): VNode {
  return { type, props, key };
}

export const jsxs = jsx;

export function jsxDEV(type: any, props: Props | null, key?: any): VNode {
  return { type, props, key };
}
