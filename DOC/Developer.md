# 说明

[按键监听](https://dtstack.github.io/molecule/zh-CN/docs/guides/extend-keybinding) —— `C-s` 保存功能的设计

1. 在 `src/extensions/action/keybindingAction.ts` 定义 Action 对象
   代码中，首先，我们先基于 `Action2` 抽象类，定义 `KeybindingAction` 对象。keybinding 字段则是快捷键的主要部分。我们在 `primary` 这里定义了一个 `Command`/`Ctrl + S` 的组合键，触发函数 `run` 执行了一个 alert。 其中 `id` 参数为 当前 `Action` 的 `ID`，我们可以使用 `executeCommand(actionId)` 方法主动触发这个 `Action`。
2. 在 `src/extensions/action/index.ts` 注册 Action
   定义好的 Action 对象，需要使用 ExtensionService 对象的 registerAction 方法进行注册。



获取编辑器内容

1. `src/extensions/userFolders/folderTreeController.ts`



获取文件路径

> 文件当前打开的文件采用的是本地存储策略，存储由 `src/components/localStorage/index.tsx` 提供

1. 在 `src/extensions/userFolders/folderTreeController.ts` 添加存储当前打开文件的步骤
2. 在 `src/components/getFilePath/index.tsx` 定义方法
3. 
