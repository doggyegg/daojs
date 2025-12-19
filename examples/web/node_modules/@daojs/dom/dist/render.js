import { createEffect } from "@daojs/core";
import { mount } from "./runtime/mount";
export function render(factory, container) {
    container.textContent = "";
    const dispose = createEffect(() => {
        container.textContent = "";
        mount(factory(), container);
    });
    return dispose;
}
//# sourceMappingURL=render.js.map