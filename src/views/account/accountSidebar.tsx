// UI
import React from 'react'
import molecule from '@dtinsight/molecule'
import { Header, Content } from '@dtinsight/molecule/esm/workbench/sidebar'
import {
  IActionBarItemProps,
  ITreeNodeItemProps,
} from '@dtinsight/molecule/esm/components'
import { ICollapseItem } from '@dtinsight/molecule/esm/components/collapse'
import { localize } from '@dtinsight/molecule/esm/i18n/localize'

import API from '../../api'
import AccountDetail from '../../components/account/detail'
import { openCreateAccountView } from '../../extensions/account/base'

const Tree = molecule.component.TreeView
const Toolbar = molecule.component.Toolbar
const Collapse = molecule.component.Collapse
export class AccountSidebarView extends React.Component {
  state = {
    data: [],
    currentAccount: undefined,
  }

  componentDidMount() {
    this.fetchData()
    molecule.event.EventBus.subscribe('addAccount', () => {
      this.reload()
    })
  }

  // 获取数据
  async fetchData() {
    const res = await API.getAccount()
    if (res.message === 'success') {
      this.setState({
        data: res.data.children || [],
      })
    }
  }

  // 获取账户
  fetchAccount = async (id: string) => {
    const account = await API.getAccountById(id)
    this.setState({ currentAccount: account })
  }

  // 重载
  reload() {
    this.fetchData()
  }

  // 创建
  create() {
    openCreateAccountView()
  }

  selectedSource = (node: ITreeNodeItemProps) => {
    if (node.isLeaf) {
      this.fetchAccount(node.id as string)
    }
  }

  // 渲染按钮
  renderHeaderToolbar(): IActionBarItemProps[] {
    return [
      {
        icon: 'refresh',
        id: 'reload',
        title: 'Reload',
        onClick: () => this.reload(),
      },
      {
        icon: 'add',
        id: 'addAccount',
        title: 'Create Data Source',
        onClick: () => this.create(),
      },
    ]
  }

  renderCollapse(): ICollapseItem[] {
    const account: AccountType | undefined = this.state.currentAccount
    return [
      {
        id: 'AccountList',
        name: 'Catalogue',
        renderPanel: () => {
          return <Tree data={this.state.data} onSelect={this.selectedSource} />
        },
      },
      {
        id: 'AccountDetail',
        name: 'Detail',
        renderPanel: () => {
          return <AccountDetail account={account} />
        },
      },
    ]
  }

  render() {
    return (
      <div className="account" style={{ width: '100%', height: '100%' }}>
        <Header
          title={localize('demo.accountManagement', 'Account Management')}
          toolbar={<Toolbar data={this.renderHeaderToolbar()} />}
        />
        <Content>
          <Collapse data={this.renderCollapse()} />
        </Content>
      </div>
    )
  }
}

export default AccountSidebarView
