import { createState, createComputed, batch } from "@daojs/core";
import { render } from "@daojs/dom";

function App() {
  const count = createState(0);
  const items = createState<Array<{ id: number; text: string }>>([
    { id: 1, text: "a" },
    { id: 2, text: "b" },
    { id: 3, text: "c" },
  ]);

  const double = createComputed(() => count() * 2);

  const inc = () => count.set((c) => c + 1);
  const addFront = () =>
    items.set((prev) => [{ id: Date.now(), text: "new" }, ...prev]);
  const shuffle = () =>
    items.set((prev) => {
      const next = [...prev];
      next.reverse();
      return next;
    });

  const multi = () => {
    batch(() => {
      count.set((c) => c + 1);
      count.set((c) => c + 1);
    });
  };

  return (
    <div style={{ padding: "16px", fontFamily: "system-ui" }}>
      <h2>daojs demo</h2>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button onClick={inc}>+1</button>
        <button onClick={multi}>batch +2</button>
        <div>count: {() => count()}</div>
        <div>double: {() => double()}</div>
      </div>

      <hr />

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button onClick={addFront}>unshift</button>
        <button onClick={shuffle}>reverse</button>
      </div>

      <ul>
        {() =>
          items().map((it) => (
            <li key={it.id}>
              {it.id}: {it.text}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

render(() => <App />, document.getElementById("app")!);
