// 主页面：仅定义布局
import 'reflect-metadata'
import { container } from 'tsyringe'
import React from 'react'

import { EditorView } from '@dtinsight/molecule/esm//workbench/editor'
import {
  SidebarView,
  Sidebar,
} from '@dtinsight/molecule/esm//workbench/sidebar'
import { ActivityBarView } from '@dtinsight/molecule/esm/workbench/activityBar'
import { StatusBarView } from '@dtinsight/molecule/esm//workbench/statusBar'
import { PanelView } from '@dtinsight/molecule/esm//workbench/panel'
import { MenuBarView } from '@dtinsight/molecule/esm/workbench/menuBar'

import { ID_APP } from '@dtinsight/molecule/esm/common/id'
import { APP_PREFIX } from '@dtinsight/molecule/esm/common/const'
import {
  classNames,
  getFontInMac,
  prefixClaName,
  getBEMModifier,
  getBEMElement,
} from '@dtinsight/molecule/esm/common/className'

import { connect } from '@dtinsight/molecule/esm/react'

import {
  ILayoutController,
  LayoutController,
} from '@dtinsight/molecule/esm/controller/layout'
import { LayoutService } from '@dtinsight/molecule/esm/services'
import {
  ILayout,
  MenuBarMode,
} from '@dtinsight/molecule/esm/model/workbench/layout'
import { IWorkbench } from '@dtinsight/molecule/esm/model/workbench'
import { Display, Pane, SplitPane } from '@dtinsight/molecule/esm/components'

import { BlockchainSidePane } from './blockchainSidePane'

const mainBenchClassName = prefixClaName('mainBench')
const workbenchClassName = prefixClaName('workbench')
const compositeBarClassName = prefixClaName('compositeBar')
const appClassName = classNames(APP_PREFIX, getFontInMac())
const workbenchWithHorizontalMenuBarClassName = getBEMModifier(
  workbenchClassName,
  'with-horizontal-menuBar'
)
const withHiddenStatusBar = getBEMModifier(
  workbenchClassName,
  'with-hidden-statusBar'
)
const displayActivityBarClassName = getBEMElement(
  workbenchClassName,
  'display-activityBar'
)

const layoutController = container.resolve(LayoutController)
const layoutService = container.resolve(LayoutService)
// 工作区
function WorkbenchView(props: IWorkbench & ILayout & ILayoutController) {
  const {
    activityBar,
    menuBar,
    panel,
    sidebar,
    statusBar,
    onPaneSizeChange,
    onHorizontalPaneSizeChange,
    splitPanePos,
    horizontalSplitPanePos,
  } = props

  const getSizes = () => {
    if (panel.hidden) {
      return ['100%', 0]
    }
    if (panel.panelMaximized) {
      return [0, '100%']
    }
    return horizontalSplitPanePos
  }

  const isMenuBarVertical =
    !menuBar.hidden && menuBar.mode === MenuBarMode.vertical
  const isMenuBarHorizontal =
    !menuBar.hidden && menuBar.mode === MenuBarMode.horizontal
  const horizontalMenuBar = isMenuBarHorizontal
    ? workbenchWithHorizontalMenuBarClassName
    : null
  const hideStatusBar = statusBar.hidden ? withHiddenStatusBar : null
  const workbenchFinalClassName = classNames(
    workbenchClassName,
    horizontalMenuBar,
    hideStatusBar
  )

  const handleSideBarChanged = (sizes: number[]) => {
    if (sidebar.hidden) {
      const clientSize = sizes[1]
      const sidebarSize = splitPanePos[0]
      if (typeof sidebarSize === 'string') {
        // the sideBar size is still a default value
        const numbSize = parseInt(sidebarSize, 10)
        onPaneSizeChange?.([numbSize, clientSize - numbSize])
      } else {
        onPaneSizeChange?.([sidebarSize, clientSize - sidebarSize])
      }
    } else {
      onPaneSizeChange?.(sizes)
    }
  }

  const handleEditorChanged = (sizes: number[]) => {
    if (panel.hidden) {
      // get the non-zero size means current client size
      const clientSize = sizes.find((s) => s)!
      const panelSize = horizontalSplitPanePos[1]
      if (typeof panelSize === 'string') {
        // the editor size is still a default value
        const editorPercent =
          parseInt(horizontalSplitPanePos[0] as string, 10) / 100
        const numbericSize = clientSize * editorPercent
        onHorizontalPaneSizeChange?.([numbericSize, clientSize - numbericSize])
      } else {
        onHorizontalPaneSizeChange?.([clientSize - panelSize, panelSize])
      }
    } else {
      onHorizontalPaneSizeChange?.(sizes)
    }
  }

  return (
    <div
      id={ID_APP}
      className={classNames(appClassName, 'myMolecule')}
      tabIndex={0}
    >
      <div className={workbenchFinalClassName}>
        <Display visible={isMenuBarHorizontal}>
          {/* 顶部菜单栏 */}
          <MenuBarView mode={MenuBarMode.horizontal} />
        </Display>
        {/* 中间 */}
        <div className={mainBenchClassName}>
          <div className={compositeBarClassName}>
            <Display visible={isMenuBarVertical}>
              <MenuBarView mode={MenuBarMode.vertical} />
            </Display>
            <Display
              visible={!activityBar.hidden}
              className={displayActivityBarClassName}
            >
              {/* 左侧菜单栏 */}
              <ActivityBarView />
            </Display>
          </div>
          {/* -------------------------- */}
          <SplitPane
            sizes={sidebar.hidden ? [0, '100%'] : splitPanePos}
            split="vertical"
            allowResize={[false, true]}
            onChange={handleSideBarChanged}
          >
            <Pane minSize={170} maxSize="80%">
              {/* 文件导航 */}
              <SidebarView />
            </Pane>
            <SplitPane
              sizes={getSizes()}
              allowResize={[false, true]}
              split="horizontal"
              onChange={handleEditorChanged}
            >
              <Pane minSize="20%" maxSize="80%">
                {/* 编辑器 */}
                <EditorView />
              </Pane>
              <PanelView />
              {/* 终端窗口 */}
            </SplitPane>
          </SplitPane>
          <div style={{ width: 300 }}>
            {/* 右侧工具栏 */}
            <Sidebar
              current={BlockchainSidePane.id}
              panes={[BlockchainSidePane]}
            />
          </div>
        </div>
      </div>
      {/* 底部状态栏 */}
      <Display visible={!statusBar.hidden}>
        <StatusBarView />
      </Display>
    </div>
  )
}

export default connect(layoutService, WorkbenchView, layoutController)
