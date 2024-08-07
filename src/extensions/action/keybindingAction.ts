import { KeybindingWeight } from '@dtinsight/molecule/esm/monaco/common'
import { KeyCode, KeyMod } from '@dtinsight/molecule/esm/monaco'
import { Action2 } from '@dtinsight/molecule/esm/monaco/action'
//@ts-ignore
import { KeyChord } from 'monaco-editor/esm/vs/base/common/keyCodes'
import api from 'src/api/index'
import GetFileContent, { getFileContent } from 'src/components/getCode'
import getFilePath from 'src/components/getFilePath'
import axios from 'axios'
import { FILE_PORT, HOST_IP } from 'src/components/port'
import molecule from '@dtinsight/molecule'
import { localize } from '@dtinsight/molecule/esm/i18n/localize'

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

  async run(accessor: any, ...args: any[]) {
    const fileContent = await getFileContent()
    const filePath = await getFilePath()
    molecule.panel.appendOutput(`Save ${filePath} ...\n`)
    // alert('Save success!')
    console.log('[fetch](keybindingAction.ts) File content: ', fileContent)
    console.log('[fetch](keybindingAction.ts) File path: ', filePath)
    // 发送请求
    const data = {
      fileContent: fileContent, // 文件内容
      filePath: filePath,
    }

    const config = {
      credentials: 'include', // 确保请求携带cookie
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      console.log('[handle] Save file: ', filePath)
      const response = await axios.post(
        `http://${HOST_IP}:${FILE_PORT}/save-code`,
        data,
        config
      )
      console.log('服务器响应:', response.data)
      molecule.panel.appendOutput(
        `Response: \n${JSON.stringify(response.data, null, 2)} \n`
      )
      if (200 === response.status) {
        molecule.panel.appendOutput(localize('move.saveSuccess', '保存成功'))
        molecule.panel.appendOutput(
          '\n---------------------------------------\n'
        )
      }
    } catch (error) {
      console.error('请求失败:', error)
      alert(('Save Faild! ERROR: \n' + error) as string)
    }

    // const filePath =
    // const save_status = await api.save_code(fileContent)

    // do something
  }
}
