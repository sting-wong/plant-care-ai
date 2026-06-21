# 自迭代循环 (Loop)

这是「植物管家 Plant Care AI」的自迭代工作循环定义。每一轮（Round）按下面的流程推进，目标是持续提升产品可用性与体验，而不是堆功能。

## 循环流程

1. **读状态** — 先读 `loop-state.md`，确认上一轮做了什么、当前优先级、未完成项。
2. **对齐原则** — 读 `product-principles.md`，所有改动必须符合产品原则；与原则冲突的需求要先质疑。
3. **选目标** — 从未完成项里挑本轮要解决的 1～3 个 P0/P1 问题。优先修「核心流程跑不通 / 数据不一致 / 体验断裂」，其次才是新功能。
4. **实现** — 读相关代码后再动手，复用现有模式与组件，不引入新依赖除非必要。
5. **验证** — `npm run build` 必须通过；涉及核心流程的改动要在 http://8.130.151.197:3001 上真机走一遍。
6. **记录** — 把本轮结果、遗留问题、下轮优先级写回 `loop-state.md`，并更新 memory。
7. **部署** — 提交 commit，必要时 push + ECS `git pull && npm run build` + `pm2 restart`。

## 安全约束（始终生效）

- 不要把 API key 写入源码。
- 不要在日志里打印 API key。
- `ARK_API_KEY` 只存在于 `.env.local`，不提交到 git。

## 部署环境

- 线上：http://8.130.151.197:3001 （ECS，端口 3001，不是 3000）
- 服务器路径：`/home/admin/plant-care-ai`
- PM2 进程：`plant-care-ai`
- 核心验收入口：`/scan` 上传照片 → 豆包诊断 → 保存到植物 → 首页 gardenScore

## 每轮结束的检查清单

- [ ] build 通过
- [ ] 核心流程真机验证过
- [ ] `loop-state.md` 已更新
- [ ] 改动符合 `product-principles.md`
- [ ] 无 key 泄漏
