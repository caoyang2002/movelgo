// 编辑上方右侧的三个点
import molecule from '@dtinsight/molecule'
import { IExtension } from '@dtinsight/molecule/esm/model/extension'
import { IExtensionService } from '@dtinsight/molecule/esm/services'
import { EDITOR_ACTION_RUNNING, EDITOR_ACTION_GITHUB } from './base'
import api from '../../api'
import { useFileContent, getFileContent } from '../../components/getCode'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
// import { ToastContainer, toast } from 'react-toastify';
export class RunningExtension implements IExtension {
  id: string = ''
  name: string = ''

  private _timer!: any

  constructor(id: string = 'EditorRunning', name: string = 'EditorRunning') {
    this.id = id
    this.name = name
  }

  activate(extensionCtx: IExtensionService): void {
    this.initUI()
    this.onClickAction()
  }

  initUI() {
    // TODO
    this._timer = setTimeout(() => {
      const builtInEditorInitialActions = molecule.builtin.getModule(
        'builtInEditorInitialActions'
      )
      molecule.editor.setDefaultActions([
        { ...EDITOR_ACTION_RUNNING },
        { ...EDITOR_ACTION_GITHUB },
        ...builtInEditorInitialActions?.value,
      ])
    })
  }

  // 运行按钮
  onClickAction() {
    molecule.editor.onActionsClick(async (menuId, current) => {
      switch (menuId) {
        case EDITOR_ACTION_RUNNING.id: {
          // const [content, setContent] = useState(null) // 用于存储文件内容
          console.log('[HANDLE] click running button')
          molecule.panel.appendOutput('[START] Running Move code ...\n')
          let response
          try {
            molecule.editor.updateActions([
              {
                id: EDITOR_ACTION_RUNNING.id,
                icon: 'loading~spin',
                disabled: true,
              },
            ])
            const data = await getFileContent()
            //通过 api 发送给 3010
            response = await api.code_test(data)
            console.log('[INFO] compile result', response.data)
            // const notifySuccess = (message: string) => {
            //   toast.success(message, {
            //     autoClose: 5000, // 弹窗在 5 秒后自动关闭
            //     hideProgressBar: true,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //   })
            // }
            // notifySuccess('编译成功！')
            molecule.panel.appendOutput(response.data.message + '\n')
            molecule.panel.appendOutput(response.data.data + '\n')
          } catch (error) {
            molecule.panel.appendOutput(error as string)
            console.error('[ERROR] Failed to get file content', error)
          }

          molecule.panel.appendOutput('Running finished!\n')
          this._timer = setTimeout(() => {
            molecule.editor.updateActions([
              {
                ...EDITOR_ACTION_RUNNING,
                disabled: false,
              },
            ])
            molecule.panel.appendOutput(
              '[END] Running end.\n-----------------------------------------------\n'
            )
          }, 600)
          break
        }
        case EDITOR_ACTION_GITHUB.id: {
          window.open('https://github.com/caoyang2002/movelgo', '_blank')
          break
        }
        default: {
          //
        }
      }
    })
  }

  dispose(extensionCtx: IExtensionService): void {
    clearTimeout(this._timer)
  }
}
