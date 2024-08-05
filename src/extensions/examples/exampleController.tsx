import molecule from '@dtinsight/molecule'
import {
  IActivityBarItem,
  IEditorTab,
  ISidebarPane,
  IMenuBarItem,
} from '@dtinsight/molecule/esm/model'
import { EXAMPLE_ID } from './base'
// import { ISidebarPane } from '@dtinsight/molecule/esm/model'

// export const EXAMPLE_ID = 'ExampleId'
export async function initExample() {
  console.log('initExample')
  // molecule.sidebar.add({ id: '1' })
}
export function handleSelectExample() {}

export const exampleActivityBar: IActivityBarItem = {
  id: EXAMPLE_ID,
  sortIndex: 3, // sorting the account to the first position
  name: 'Example',
  title: 'Example Management',
  icon: 'library',
}
