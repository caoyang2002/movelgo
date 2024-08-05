import { IExtension } from '@dtinsight/molecule/esm/model/extension'
import { IExtensionService } from '@dtinsight/molecule/esm/services'
import * as folderTreeController from './folderTreeController'
import * as searchPaneController from './searchPaneController'
export class UserFiles implements IExtension {
  id: string = 'userfiles'
  name: string = 'userFiles'

  constructor(id: string = 'User Files', name: string = 'User Files') {
    this.id = id
    this.name = name
  }

  activate(extensionCtx: IExtensionService): void {
    folderTreeController.initFolderTree()
    folderTreeController.handleSelectFolderTree()
    folderTreeController.handleStatusBarLanguage()
    //
    folderTreeController.handleCreateFile()
    //
    searchPaneController.handleSearchEvent()
    searchPaneController.handleSelectSearchResult()
    // ------------------
  }

  dispose(extensionCtx: IExtensionService): void {
    throw new Error('Method not implemented.')
  }
}
