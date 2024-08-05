import { IExtension } from '@dtinsight/molecule/esm/model'
import { DataSourceExtension } from './dataSource'
import { UserFiles } from './userFolders'
import { TerminalExtension } from './terminal'
import { ProblemsExtension } from './problems'
import { RunningExtension } from './running'
import { OneDarkPro } from './oneDarkPro/index'
import { ExtendLocales } from './i18n'
import { SettingsExtension } from './settings'
import { MenuBarExtension } from './menubar/index'
import { ActionExtension } from './action'
import { GoToGithubExtension } from './github'
import { AccountExtension } from './account'
import { ExampleExtension } from './examples'

// 渲染顺序
const extensions: IExtension[] = [
  // 账户
  new AccountExtension(),
  // 文件
  new UserFiles(),
  // 数据库
  new DataSourceExtension(),
  // 终端
  new TerminalExtension(),
  // 问题
  new ProblemsExtension(),
  // 运行
  new RunningExtension(),
  // 设置
  new SettingsExtension(),
  // 菜单
  new MenuBarExtension(),
  // 动作
  new ActionExtension(),
  // example
  new ExampleExtension(),
  // Github
  GoToGithubExtension,
  // 主题
  OneDarkPro,
  // 语言
  ExtendLocales,
]

export default extensions
