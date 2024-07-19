// 右侧区块链面板 UI
import React from 'react'
import molecule from '@dtinsight/molecule'
import { Header, Content } from '@dtinsight/molecule/esm/workbench/sidebar'
import { IActionBarItemProps } from '@dtinsight/molecule/esm/components'
import { localize } from '@dtinsight/molecule/esm/i18n/localize'
import { ISidebarPane } from '@dtinsight/molecule/esm/model'
// import PostRequestComponent from 'src/ui_movelgo/handleInputChange'
// import CreateFolder from 'src/ui_movelgo/createFolder'
import FetchFloderNameByCookie from 'src/TEST/fetchFloderName'
import CreatePath from 'src/TEST/createPath'
import useFolderName from 'src/TEST/fetchFolderNameValue'
// import CreateAndFetchFiles from '@/TEST/createFile'

const Toolbar = molecule.component.Toolbar

export function BlockchainSidePaneView() {
  const renderHeaderToolbar = React.useCallback((): IActionBarItemProps[] => {
    return [
      {
        icon: 'menu',
        id: 'tools',
        title: 'Aptos',
      },
    ]
  }, [])

  const folderName = useFolderName()
  const address = '0x1'

  return (
    <>
      <div className={'mySidePane'}>
        <Header
          title={localize('demo.rightSidebar.title', 'Tools')}
          toolbar={<Toolbar data={renderHeaderToolbar()} />}
        />
        <Content>
          <p style={{ textAlign: 'center' }}>Move on Aptos</p>
          <h1 className="">Address: {address}</h1>
        </Content>
      </div>
      <Header
        title={localize('demo.rightSidebar.title', 'TEST')}
        toolbar={<Toolbar data={renderHeaderToolbar()} />}
      />
      <CreatePath />

      <h1 className="">Folder Name</h1>
      <p>{folderName}</p>
      {/* <CreateAndFetchFile /> */}
      <FetchFloderNameByCookie />
      {/* <CreateFolder /> */}
    </>
  )
}

export const MySidePane: ISidebarPane = {
  id: 'mySidePane',
  // title: 'Tools',
  title: 'Move',
  render: () => {
    return <BlockchainSidePaneView />
  },
}
