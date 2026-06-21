# 循环状态 (Loop State)

> 每轮结束更新本文件。最新一轮放在最上面。

## 当前优先级（下一轮候选）

- P0：上 HTTPS（issues.md #1）— 服务器/部署层，需在 ECS 配 Caddy/Nginx 反代签证书。代码层做不了。HTTP 下 `capture` / getUserMedia 会失效，这是「拍照只能退化成相册」的根因。
- P1：图片改存 IndexedDB（issues.md #4）— localStorage ~5MB 易写爆丢数据。注意：不能简单用 partialize 排除 imageBase64，会让诊断页刷新丢图、最近诊断缩略图失效；要真迁 IndexedDB（idb-keyval 作 persist storage）。需单独一轮设计。
- P1：Service Worker + 图标补齐（issues.md #2）— 装 @serwist/next 或 next-pwa，补 192/512/maskable PNG。
- P1：豆包接入真机验收 — 确认 ECS `.env.local` 的 `ARK_API_KEY` 生效，从 `/scan` 上传真实照片能返回中文诊断。
- P2：CSP 响应头（issues.md #5 剩余）— 需结合豆包 API 域名，先 report-only 验证再强制。

## Round 5.2（已完成）— issues.md 纯代码高优先级项

- ✅ #3 首页日期烤死：`page.tsx` 改用 mounted 门控（useState/useEffect），挂载后才用真实 `new Date()` 渲染日期/问候，消除预渲染闪旧日期。
- ✅ #5 安全响应头（部分）：`next.config.ts` 加 `poweredByHeader:false` + X-Content-Type-Options / X-Frame-Options / Referrer-Policy / HSTS。CSP 留到专门一轮（避免打断豆包请求）。
- ⏸️ #4 图片存储：本轮不动，partialize 方案有真实 UX 代价，改 IndexedDB 需单独决策（见上方候选）。
- build 通过（17/17 页面）。**未提交、未部署**，等用户确认。

## Round 5（已完成）— P0 核心可用性

- AI 切换到火山方舟豆包 `doubao-seed-1-6-flash`（Responses API），ZHIPU 保留为 fallback。
- 品类 chip 扩到 7 类（热带观叶 / 花叶观赏 / 多肉仙人掌 / 蕨类 / 兰科 / 块根球根 / 大型绿植）。
- 数据一致性：health 状态从诊断置信度推导并贯穿保存流程。
- gardenScore 计入 health 惩罚（urgent -20，watch -10，逾期 -15）。
- commit `5e95947`，已 push + ECS 部署，PM2 在 3001 端口正常运行。

## Round 5.1（已完成）— 体验修补

- ✅ 修复添加植物照片只能拍照、无法从相册导入的问题（`plants/add/page.tsx` 移除 `capture="environment"`）。

## 遗留 / 待确认

- ECS `.env.local` 中 `ARK_API_KEY` 是否真实生效（豆包真机调用未最终验收）。
- `/scan` 入口的相册导入是否也已就绪（待核对 `photo-capture.tsx` 已是双 input，理论上 OK）。
