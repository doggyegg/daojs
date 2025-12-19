import { createEffect } from "@daojs/core";
import type { VNode } from "./types";
import { mount } from "./runtime/mount";

export function render(factory: () => VNode, container: Element): () => void {
  container.textContent = "";
  const dispose = createEffect(() => {
    container.textContent = "";
    mount(factory(), container);
  });
  return dispose;
}
