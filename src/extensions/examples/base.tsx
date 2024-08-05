import {
  IActivityBarItem,
  IEditorTab,
  ISidebarPane,
  IMenuBarItem,
} from '@dtinsight/molecule/esm/model'
import ExampleView from '../../views/examples/exampleSidebar'
import CreateDataSourceView from '../../views/examples/createExample'
import molecule from '@dtinsight/molecule'
import { localize } from '@dtinsight/molecule/esm/i18n/localize'

export const EXAMPLE_ID = 'exampleId'

export const exampleActivityBar: IActivityBarItem = {
  id: EXAMPLE_ID,
  sortIndex: 0, // sorting the dataSource to the first position
  name: 'Example',
  title: 'Example Management',
  icon: 'library',
}

// 侧边栏显示
export const exampleSidebar: ISidebarPane = {
  id: EXAMPLE_ID,
  title: 'ExamplePane',
  render: () => {
    return <ExampleView />
  },
}

// 创建 Tab
export const createDataSourceTab: IEditorTab = {
  id: EXAMPLE_ID,
  name: 'Create Data Source',
  renderPane: () => {
    return <CreateDataSourceView />
  },
}

// 创建项
export const createDataSourceMenuItem: IMenuBarItem = {
  id: 'menu.createExample',
  name: localize('menu.createExample', 'Create Example'),
  icon: '',
}

// 打开创建视图
export function openCreateDataSourceView() {
  molecule.editor.open(createDataSourceTab)
}

// 已存在试视图
export function existCreateDataSourceView() {
  const group = molecule.editor.getState().current
  if (group) {
    molecule.editor.closeTab(createDataSourceTab.id!, group.id!)
  }
}
