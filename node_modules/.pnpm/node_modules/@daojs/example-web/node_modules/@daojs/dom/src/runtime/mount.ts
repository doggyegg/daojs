import { createEffect } from "@daojs/core";
import { Fragment } from "../jsx-runtime";
import type { VNode } from "../types";
import { mountChildren } from "./mountChildren";

export function mount(node: any, parent: Node): Node {
  if (node == null || node === false || node === true) {
    const comment = document.createComment("");
    parent.appendChild(comment);
    return comment;
  }

  if (typeof node === "string" || typeof node === "number") {
    const text = document.createTextNode(String(node));
    parent.appendChild(text);
    return text;
  }

  if (Array.isArray(node)) {
    const marker = document.createComment("");
    parent.appendChild(marker);
    for (const child of node) mount(child, parent);
    return marker;
  }

  if (typeof node === "function") {
    // children 允许传 () => any：作为动态区域
    const start = document.createComment("dao:start");
    const end = document.createComment("dao:end");
    parent.appendChild(start);
    parent.appendChild(end);

    createEffect(() => {
      // 简化：每次更新重建这段区域（MVP）
      let cur = start.nextSibling;
      while (cur && cur !== end) {
        const next = cur.nextSibling;
        parent.removeChild(cur);
        cur = next;
      }
      const value = node();
      mount(value, parent);
      parent.insertBefore(end, null);
    });

    return end;
  }

  const vnode = node as VNode;

  if (vnode.type === Fragment) {
    const marker = document.createComment("");
    parent.appendChild(marker);
    mountChildren(vnode.props?.children, parent);
    return marker;
  }

  if (typeof vnode.type === "function") {
    const rendered = vnode.type(vnode.props ?? {});
    return mount(rendered, parent);
  }

  const el = document.createElement(vnode.type);
  const props = vnode.props ?? {};

  for (const [k, v] of Object.entries(props)) {
    if (k === "children") continue;
    if (k === "class") {
      el.className = v ?? "";
      continue;
    }
    if (k === "style" && v && typeof v === "object") {
      Object.assign((el as HTMLElement).style, v);
      continue;
    }
    if (k.startsWith("on") && typeof v === "function") {
      const event = k.slice(2).toLowerCase();
      el.addEventListener(event, v);
      continue;
    }
    if (v == null || v === false) {
      el.removeAttribute(k);
      continue;
    }
    el.setAttribute(k, String(v));
  }

  parent.appendChild(el);
  mountChildren(props.children, el);
  return el;
}
