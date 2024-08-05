import molecule from '@dtinsight/molecule'
import { Float, IFolderTreeNodeProps } from '@dtinsight/molecule/esm/model'
import { transformToEditorTab } from '../../common'

import { cloneDeep } from 'lodash'
import API from '../../api'
import { STATUS_BAR_LANGUAGE } from './base'

// 初始化（获取文件夹内容）
export async function initFolderTree() {
  // const res = await API.getFolderTree()
  // console.log('res', res.data)
  // if (res.message === 'success') {
  //   const folderTreeData = cloneDeep(res.data)
  //   molecule.folderTree.add(folderTreeData)
  // }
  const response = (await API.getFolderTree()).data
  console.log('获取 project json:', response) // {code: 200, message: 'success', folderName: [...]}
  const projectJson = JSON.parse(response as unknown as string)
  console.log('projectjson', projectJson)
  if (projectJson.message === 'success') {
    console.log('获取 project json 成功')
    const folderTreeData = cloneDeep(projectJson.data)
    console.log('folderTreeData:', folderTreeData)
    molecule.folderTree.add(folderTreeData)
  }
}
//  负责处理 FolderTree 的 onSelectFile 事件，选中文件后，在 Editor 中打开
export function handleSelectFolderTree() {
  molecule.folderTree.onSelectFile((file: IFolderTreeNodeProps) => {
    console.log('filedata', file.data)
    console.log('file', transformToEditorTab(file))
    molecule.editor.open(transformToEditorTab(file))
    updateStatusBarLanguage(file.data.language)
  })
}
// 更新状态栏的语言
export function updateStatusBarLanguage(language: string) {
  if (!language) return
  language = language.toUpperCase()
  const languageStatusItem = molecule.statusBar.getStatusBarItem(
    STATUS_BAR_LANGUAGE.id,
    Float.right
  )
  if (languageStatusItem) {
    languageStatusItem.name = language
    molecule.statusBar.update(languageStatusItem, Float.right)
  } else {
    molecule.statusBar.add(
      Object.assign({}, STATUS_BAR_LANGUAGE, { name: language }),
      Float.right
    )
  }
}
//
export function handleStatusBarLanguage() {
  const moleculeEditor = molecule.editor
  moleculeEditor.onSelectTab((tabId, groupId) => {
    console.log(groupId)
    if (!groupId) return
    const group = moleculeEditor.getGroupById(groupId)
    if (!group) return
    const tab: any = moleculeEditor.getTabById(tabId, group.id!)
    if (tab) {
      updateStatusBarLanguage(tab.data!.language!)
    }
  })
}
export function handleCreateFile() {
  molecule.folderTree.onCreate((type, nodeId) => {
    console.log('[Contrlerl] create file')
    console.log('type', type, 'nodeId', nodeId)
  })
  // const moleculeEditor = molecule.folderTree.onCreate
  // moleculeEditor.onCreate()
}
