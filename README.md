# daojs

## 设计初衷

前端开发在 Vue 与 React 两条路线里长期存在一个核心取舍：

- Vue 提供了更强的响应式依赖追踪与更精确的更新触发，性能与心智模型都更贴近“数据驱动视图”。
- React 提供了更自然的函数组件编程体验与 JSX/All-in-JS 的表达能力，但默认更新模型会带来不必要的渲染传播，通常需要开发者手动通过 memo 等手段优化。

`daojs` 的目标是：

- 保留函数组件与 JSX 的自然表达。
- 引入“state 驱动、依赖自动追踪”的更新机制，让更新只发生在真正依赖变更的最小范围内。
- 让性能优化尽量成为框架默认行为，而不是业务层的额外负担。

## 设计理念（道）

`dao`（道）强调“自然与和谐”：

- **自然**：写法尽量贴近 JavaScript/TypeScript 与 JSX 的原生表达，减少模板语法糖。
- **无为**：尽量减少“为了性能而写的代码”，让框架通过依赖追踪自动完成更新。
- **因果**：你读取了什么 state，就只为它建立依赖；依赖变了才触发更新。
- **收敛**：先把 Web DOM 渲染链路打通，再逐步增强增量更新、生命周期、编译期体验。

## 当前架构

本仓库是一个 pnpm workspace：

- `packages/core`（`@daojs/core`）
  - 响应式内核：state、effect、computed、batch/scheduler
- `packages/dom`（`@daojs/dom`）
  - JSX runtime + DOM 渲染器
- `examples/web`
  - Vite 示例项目，用于验证运行链路

## 已完成（当前可用）

- **state 原语（方案 B）**
  - `const count = createState(0)`
  - 读取：`count()`（依赖收集）
  - 写入：`count.set(next)` / `count.set(prev => next)`（触发更新）
- **副作用与派生**
  - `createEffect(fn)`：自动依赖追踪，支持 `onCleanup`，返回 `dispose`
  - `createComputed(fn)`：脏标记 + 依赖传播
- **批处理与调度**
  - `batch(fn)` + microtask scheduler（用于合并多次更新触发）
- **JSX runtime（TS react-jsx/react-jsxdev 兼容）**
  - `jsx/jsxs/Fragment/jsxDEV`
  - `@daojs/dom` 已补齐 `./jsx-dev-runtime` 导出
- **DOM 渲染（MVP）**
  - `render(() => <App />, container)` 返回 `dispose`
  - 支持：文本/数字、数组 children、Fragment、函数组件
  - 支持：class/style(对象)/事件(onXxx)/属性 setAttribute
  - 支持：children 为 `() => any` 的动态区域（当前策略为“局部区域清空重建”）
- **示例可运行**
  - `examples/web` 已包含 Counter + computed + batch + list(key) 示例

## 待完成（下一阶段）

- **真正的增量 DOM patch**
  - 动态文本/属性做到节点级 patch（而非重建）
  - children diff（含 keyed diff 的复用/移动/删除）
- **生命周期与卸载清理**
  - 更完善的 unmount/dispose、条件创建 effect 的自动清理策略
- **更自然的 JSX state 使用体验（编译期）**
  - 目标：JSX 中尽量不写 `() => count()` 这种包装
  - 方案：编译期识别 `createState` 产物并自动改写（范围 B1/B2 待确认）
- **类型系统完善**
  - 将 JSX IntrinsicElements 等类型声明从示例工程兜底，逐步收敛到 `@daojs/dom`
- **工程化**
  - 更规范的产物输出（dist 结构、类型声明策略）
  - lint/test/bench 与发布流程

## 开发与运行

- 安装依赖：

```bash
pnpm install
```

- 启动示例：

```bash
pnpm dev
```

- 构建：

```bash
pnpm -r build
```

## 说明

当前版本定位为 **MVP 骨架**：核心在于跑通“state → 依赖追踪 → 触发更新 → DOM 渲染”的全链路，后续会围绕增量更新与编译期体验继续演进。
