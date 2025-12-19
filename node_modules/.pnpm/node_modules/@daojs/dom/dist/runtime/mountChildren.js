import { createEffect } from "@daojs/core";
import { mount } from "./mount";
export function mountChildren(children, parent) {
    if (children == null)
        return;
    // children 支持 () => any：作为动态区域
    if (typeof children === "function") {
        const start = document.createComment("dao:children:start");
        const end = document.createComment("dao:children:end");
        parent.appendChild(start);
        parent.appendChild(end);
        createEffect(() => {
            let cur = start.nextSibling;
            while (cur && cur !== end) {
                const next = cur.nextSibling;
                parent.removeChild(cur);
                cur = next;
            }
            const value = children();
            mount(value, parent);
            parent.insertBefore(end, null);
        });
        return;
    }
    if (Array.isArray(children)) {
        for (const c of children)
            mount(c, parent);
        return;
    }
    mount(children, parent);
}
//# sourceMappingURL=mountChildren.js.map