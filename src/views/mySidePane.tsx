import React from 'react'
import molecule from '@dtinsight/molecule'
import { Header, Content } from '@dtinsight/molecule/esm/workbench/sidebar'
import { IActionBarItemProps } from '@dtinsight/molecule/esm/components'
import { localize } from '@dtinsight/molecule/esm/i18n/localize'
import { ISidebarPane } from '@dtinsight/molecule/esm/model'

const Toolbar = molecule.component.Toolbar

export function MySidePaneView() {
  const renderHeaderToolbar = React.useCallback((): IActionBarItemProps[] => {
    return [
      {
        icon: 'arrow-both',
        id: 'tools',
        title: 'Aptos',
      },
    ]
  }, [])

  return (
    <div className={'mySidePane'}>
      <Header
        title={localize('demo.rightSidebar.title', 'Tools')}
        toolbar={<Toolbar data={renderHeaderToolbar()} />}
      />
      <Content>
        <p style={{ textAlign: 'center' }}>Move on Aptos</p>
        <h1 className=''>Gas</h1>
      </Content>
    </div>
  )
}

export const MySidePane: ISidebarPane = {
  id: 'mySidePane',
  // title: 'Tools',
  title: 'Move',
  render: () => {
    return <MySidePaneView />
  },
}
