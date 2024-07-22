//引入
import { memo, MutableRefObject, useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { ITheme, ITerminalOptions } from 'xterm'
import 'xterm/css/xterm.css'
import { AttachAddon } from 'xterm-addon-attach'
import React from 'react'
import { FitAddon } from 'xterm-addon-fit'

// 前置命令提示
const PROPMPT = 'MOVE $ '
// 按下退格键，执行退格操作
const keymap = [
  { key: 'Backspace', shiftKey: false, mapSeq: '\b \b' } as const, // mapCode: 8
  { key: 'Backspace', shiftKey: true, mapSeq: '\b \b' } as const, // mapCode: 127
] as { key: string; shiftKey: boolean; mapCode?: number; mapSeq?: string }[]
function handleKey(
  ev: KeyboardEvent,
  term: Terminal,
  currentLine: MutableRefObject<string>
) {
  if (ev.type === 'keydown') {
    for (let i in keymap) {
      if (currentLine.current.length === 0) {
        console.log('删除结束')
        return false
      }
      if (keymap[i].key === ev.key && keymap[i].shiftKey === ev.shiftKey) {
        console.log('输入了退格键')
        currentLine.current = currentLine.current.substring(
          0,
          currentLine.current.length - 1
        )
        console.log(currentLine.current, currentLine.current.length)

        const space = keymap[i].mapCode
          ? String.fromCharCode(keymap[i].mapCode as number)
          : keymap[i].mapSeq
        // console.log(keymap[i].mapSeq)
        // 写入空格
        if (space) term.write(space)

        return false
      }
    }
  }
  return true
}

// ------------------------------------------------------------------
function WebTerminal() {
  // const fitPlugin = new FitAddon()
  let currentLine = useRef('') // 存储当前用户输入的内容
  let historyLineData: string[] = [''] // 存储用户输入的历史记录
  const terminalRef = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    const term = new Terminal({
      rendererType: 'canvas', //渲染类型

      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontWeight: 400,
      fontSize: 14,
      altClickMovesCursor: true,
      bellStyle: 'sound',
      rightClickSelectsWord: true,
      rows: 12,
      cols: 64,
      // convertEol: true, //启用时，光标将设置为下一行的开头
      scrollback: 1000, //终端中的回滚量
      cursorBlink: true, //光标闪烁
      theme: {
        foreground: '#ffffff', //字体
        background: '#151515', //背景色
        cursor: 'help', //设置光标
      },
    })
    const fitPlugin = new FitAddon()

    term.open(terminalRef.current as HTMLDivElement)
    //@ts-ignore
    // term.open(document.getElementById('terminal'))

    term.focus()
    fitPlugin.activate(term)
    term.loadAddon(fitPlugin)
    // fitPlugin.fit()
    //自适应窗口
    window.onresize = () => fitPlugin.fit()

    term.write('Welcome to Movelgo\r\n')
    term.write(PROPMPT)
    // term.loadAddon(new FitAddon())

    term.attachCustomKeyEventHandler((e) => handleKey(e, term, currentLine))

    //值键 事件
    term.onData((data) => {
      // 回车键以外的数据直接写入终端
      if (data !== '\r' && data !== '\n') {
        currentLine.current += data
        term.write(data)
      }
    })
    // 功能键 事件
    term.onKey((event) => {
      console.log('event', event)
      if (event.domEvent.key === 'Enter') {
        const input = currentLine.current.trim()
        if (input === 'ls') {
          console.log('列表')
          term.write('\r\nlist list list')
          term.write('\r\n' + PROPMPT)

          historyLineData.push(input)
          console.log(historyLineData)
          currentLine.current = ''
        }
        if (input === 'history') {
          console.log('历史')
          historyLineData.map((item) => {
            // 检查项是否不是空白字符
            if (item.trim() !== '' && !/^[\u2500-\u259F]$/.test(item)) {
              term.write('\r\n' + item + '\r\n')
            }
          })

          term.write('\r\n' + PROPMPT)

          historyLineData.push(input)
          console.log(historyLineData)
          currentLine.current = ''
        }
        if (input === 'clear') {
          term.clear()
          historyLineData.push(currentLine.current)
          term.write('\r\n' + PROPMPT)
        }
        // if (input === 'exit') {
        //   term.dispose()
        //   fitPlugin.dispose()
        // }
        if (input === 'help') {
          term.write('\r\n' + '指令\t功能')
          term.write('\r\n' + 'ls\t列表')
          term.write('\r\n' + 'clear\t清理屏幕')
          term.write('\r\n' + 'history\t查看历史' + '\r\n')
        }
        if (input === '') {
          term.write('\r\n' + PROPMPT)
          console.log('currentLine is', currentLine.current.length)
          currentLine.current = ''
          console.log('currentLine is', currentLine.current.length)
        }
      }
    })

    return () => {
      //组件卸载，清除 Terminal 实例
      term.dispose()
      fitPlugin.dispose()
    }
  }, [])

  const output = PROPMPT + currentLine.current
  return (
    <div
      className="terminal"
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        ref={terminalRef}
        style={{ height: '100%', backgroundColor: '#151515', width: '100%' }}
      ></div>
    </div>
  )
}
export default memo(WebTerminal)
