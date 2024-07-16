import {
  IActivityBarItem,
  IEditorTab,
  ISidebarPane,
  IMenuBarItem,
} from '@dtinsight/molecule/esm/model'
import AccountView from '../../views/account/accountSidebar'
import CreateAccountView from '../../views/account/createAccount'
import molecule from '@dtinsight/molecule'
import { localize } from '@dtinsight/molecule/esm/i18n/localize'

export const ACCOUNT_ID = 'Account'

export const accountActivityBar: IActivityBarItem = {
  id: ACCOUNT_ID,
  sortIndex: -1, // sorting the account to the first position
  name: 'Data Source',
  title: 'Data Source Management',
  icon: 'link',
}

export const accountSidebar: ISidebarPane = {
  id: ACCOUNT_ID,
  title: 'AccountPane',
  render: () => {
    return <AccountView />
  },
}

export const createAccountTab: IEditorTab = {
  id: ACCOUNT_ID,
  name: 'Create Account',
  renderPane: () => {
    return <CreateAccountView />
  },
}

export const createAccountMenuItem: IMenuBarItem = {
  id: 'menu.createAccount',
  name: localize('menu.createAccount', 'Create Account'),
  icon: '',
}

export function openCreateAccountView() {
  molecule.editor.open(createAccountTab)
}

export function existCreateAccountView() {
  const group = molecule.editor.getState().current
  if (group) {
    molecule.editor.closeTab(createAccountTab.id!, group.id!)
  }
}
