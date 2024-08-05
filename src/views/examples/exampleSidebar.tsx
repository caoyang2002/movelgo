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
import DataSourceDetail from '../../components/examples/detail'
import { openCreateDataSourceView } from '../../extensions/examples/base'

export const EXAMPLE_LIST = 'ExampleList'
export const EXAMPLE_DETAIL = 'ExampleDetail'

const Tree = molecule.component.TreeView
const Toolbar = molecule.component.Toolbar
const Collapse = molecule.component.Collapse
export class ExampleView extends React.Component {
  state = {
    data: [],
    currentDataSource: undefined,
  }

  componentDidMount() {
    this.fetchData()
    molecule.event.EventBus.subscribe('addDataSource', () => {
      this.reload()
    })
  }

  async fetchData() {
    const res = await API.getDataSource()
    if (res.message === 'success') {
      this.setState({
        data: res.data.children || [],
      })
    }
  }

  fetchDataSource = async (id: string) => {
    const dataSource = await API.getDataSourceById(id)
    this.setState({ currentDataSource: dataSource })
  }

  reload() {
    console.log('reload')
    this.fetchData()
  }

  create() {
    openCreateDataSourceView()
  }

  selectedSource = (node: ITreeNodeItemProps) => {
    if (node.isLeaf) {
      this.fetchDataSource(node.id as string)
    }
  }

  renderHeaderToolbar(): IActionBarItemProps[] {
    return [
      {
        icon: 'refresh',
        id: 'reload',
        title: localize('move.refreshExample', '刷新示例'),
        onClick: () => this.reload(),
      },
      {
        icon: 'add',
        id: 'addDataSource',
        title: localize('move.addExample', '添加示例'),
        onClick: () => this.create(),
      },
    ]
  }

  renderCollapse(): ICollapseItem[] {
    const dataSource: DataSourceType | undefined = this.state.currentDataSource
    return [
      {
        id: EXAMPLE_LIST,
        name: localize('move.exampleList', '示例列表'),
        renderPanel: () => {
          return <Tree data={this.state.data} onSelect={this.selectedSource} />
        },
      },
      {
        id: EXAMPLE_DETAIL,
        name: localize('move.exampleDetail', '示例详情'),
        renderPanel: () => {
          return <DataSourceDetail dataSource={dataSource} />
        },
      },
    ]
  }

  render() {
    return (
      <div className="example" style={{ width: '100%', height: '100%' }}>
        <Header
          title={localize('move.example', 'Move 示例')}
          toolbar={<Toolbar data={this.renderHeaderToolbar()} />}
        />
        <Content>
          <Collapse data={this.renderCollapse()} />
        </Content>
      </div>
    )
  }
}

export default ExampleView
