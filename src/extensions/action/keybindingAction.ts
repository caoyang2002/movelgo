import { KeybindingWeight } from '@dtinsight/molecule/esm/monaco/common'
import { KeyCode, KeyMod } from '@dtinsight/molecule/esm/monaco'
import { Action2 } from '@dtinsight/molecule/esm/monaco/action'
//@ts-ignore
import { KeyChord } from 'monaco-editor/esm/vs/base/common/keyCodes'
import api from 'src/api/index'
import GetFileContent, { getFileContent } from 'src/components/getCode'
import getFilePath from 'src/components/getFilePath'

export class KeybindingAction extends Action2 {
  static readonly ID = 'AutoSave'

  // 定义 C-s 运行
  constructor() {
    super({
      id: KeybindingAction.ID,
      precondition: undefined,
      f1: false, // Not show in the Command Palette
      keybinding: {
        weight: KeybindingWeight.WorkbenchContrib,
        when: undefined,
        primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyS),
      },
    })
  }

  run(accessor: any, ...args: any[]) {
    const fileContent = getFileContent()
    const filePath = getFilePath()
    alert('Save success!')
    console.log(fileContent)
    console.log(filePath)
    // const filePath =
    // const save_status = await api.save_code(fileContent)

    // do something
  }
}
