import { IExtension } from '@dtinsight/molecule/esm/model'
import { IExtensionService } from '@dtinsight/molecule/esm/services'
import molecule from '@dtinsight/molecule'
import { exampleActivityBar } from './exampleController'
import * as exampleController from './exampleController'
import { EXAMPLE_ID } from './base'
import {
  createDataSourceMenuItem,
  // dataSourceActivityBar,
  exampleSidebar,
} from './base'

export class ExampleExtension implements IExtension {
  id: string = EXAMPLE_ID
  name: string = 'Example'
  activate(extensionCtx: IExtensionService): void {
    this.initUI()

    // setTimeout(() => {
    //   // TODO: upgrade the Molecule and remove it.
    //   molecule.menuBar.append(createDataSourceMenuItem, 'File')
    // })
    //     exampleController.handleSelectExample()
  }
  initUI() {
    molecule.activityBar.add(exampleActivityBar)
    exampleController.initExample()
    molecule.sidebar.add(exampleSidebar)
    // molecule.activityBar.add(exampleActivityBar)
  }
  dispose(extensionCtx: IExtensionService): void {}
}
