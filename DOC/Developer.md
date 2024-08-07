# 说明

[按键监听](https://dtstack.github.io/molecule/zh-CN/docs/guides/extend-keybinding) —— `C-s` 保存功能的设计

1. 在 `src/extensions/action/keybindingAction.ts` 定义 Action 对象
   代码中，首先，我们先基于 `Action2` 抽象类，定义 `KeybindingAction` 对象。keybinding 字段则是快捷键的主要部分。我们在 `primary` 这里定义了一个 `Command`/`Ctrl + S` 的组合键，触发函数 `run` 执行了一个 alert。 其中 `id` 参数为 当前 `Action` 的 `ID`，我们可以使用 `executeCommand(actionId)` 方法主动触发这个 `Action`。

2. 在 `src/extensions/action/keybindingAction.ts` 中的 `run`添加发送保存请求

   1. 使用 `axios` 向 `http://localhost:3010/save-file` 发送请求，参数是 文件内容和路径

      ```bash
      ```

      

3. 在 `src/extensions/action/index.ts` 注册 Action
   定义好的 Action 对象，需要使用 ExtensionService 对象的 registerAction 方法进行注册。



获取编辑器内容

1. 在 `src/extensions/userFolders/folderTreeController.ts ` 中，通过编辑器实例获取到编辑器的内容： https://dtstack.github.io/molecule/zh-CN/docs/api/interfaces/molecule.IEditorService/

    



获取文件路径

> 文件当前打开的文件采用的是本地存储策略，存储由 `src/components/localStorage/index.tsx` 提供

1. 在 `src/extensions/userFolders/folderTreeController.ts` 添加保存当前打开的文件的路径到本地
2. 在 `src/components/getFilePath/index.tsx` 定义方法用于从本地获取文件路径







# 终端输出

```bash
import molecule from '@dtinsight/molecule'

molecule.panel.appendOutput(`Response: \n${response.data} \n`)
```





## 国际化

https://dtstack.github.io/molecule/zh-CN/docs/guides/extend-locales

> 切换语言
>
> 默认我们提供了2 种方法切换。
>
> - 第一种：使用 `Command` / `Ctrl + Shift + L` 快捷键
>
> - 第二种：打开使用快捷键 `Command` / `Ctrl + ,`  在 Editor 中打开设置（Settings) 面板，修改 JSON 配置中的 locale 字段：

```bash
import { localize } from '@dtinsight/molecule/esm/i18n/localize'

name = localize('move.exampleList', '示例列表')
```













# 快捷键

`C-k` 设置主题

`C-p` 搜索

`C-S-l` 设置语言

