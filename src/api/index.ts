// 数据
import axios from 'axios'
import http from '../common/http'
import {
  IFolderTree,
  IFolderTreeNodeProps,
} from '@dtinsight/molecule/esm/model'
import { Path } from 'react-router-dom'
import { FILE_PORT } from 'src/components/port'

const basePath = './mock'

const users_file = `http://localhost:${FILE_PORT}`

interface StateNode {
  code: number
  message: string
  data: any
}

const api = {
  // --------------------------------- folder
  /**
   * 获取用户项目信息
   * @returns josn 对象
   */
  async getFolderTree() {
    // return http.get(`${basePath}/folderTree.json`)
    try {
      const response = await axios.get<StateNode>(
        `${users_file}/user-project-json`,
        {
          withCredentials: true,
        }
      )
      // console.log('json response: ', response)
      return response
    } catch (error) {
      console.error('Error fetching folder name:', error)
      return { code: 404, message: error } as StateNode
    }
  },

  search(value: string) {
    return http.get(`${basePath}/folderTree.json`, { query: value })
  },

  /**
   * 保存代码
   * @param fileContent 文件内容
   * @param filePath 编辑的文件路径
   * @returns 状态码和保存状态
   */

  //TODO 报错代码的前端请求 API 实现
  async save_code(fileContent: string, filePath: Path) {
    // 请求体数据
    const data = {
      filePath: filePath,
      content: fileContent,
    }

    // 请求头，包含 cookie
    const config = {
      headers: {
        'Content-Type': 'application/json',
        withCredentials: true,
      },
    }
    try {
      const response = await axios.post<StateNode>(
        `${users_file}/save-code`,
        { data },
        { headers: config.headers }
      )
      console.log('json response: ', response)
      return response
    } catch (error) {
      console.error('Error copilling code:', error)
      return { code: 500, message: error } as StateNode
    }
  },

  //-----------------------------editor
  //TODO 编译 代码的前端请求 API 实现
  /**
   *  编译代码
   * @param fileContent 代码
   * @returns
   */
  async code_test(fileContent: string) {
    try {
      const response = await axios.post<StateNode>(
        `${users_file}/move/test`,
        { fileContent },
        {
          withCredentials: true,
        }
      )
      console.log('json response: ', response)
      return response
    } catch (error) {
      console.error('Error copilling code:', error)
      return { code: 500, message: error } as StateNode
    }
  },

  // -------------------------- data source
  getDataSource() {
    return http.get(`${basePath}/dataSource.json`)
  },

  getDataSourceById(sourceId: string): Promise<DataSourceType> {
    return new Promise<DataSourceType>((resolve, reject) => {
      const mockDataSource: DataSourceType = {
        id: sourceId,
        name: `dataSource` + sourceId,
        type: 'MySQL',
        jdbcUrl: 'http://jdbc:127.0.0.1//3306',
        updateTime: Date.now() + '',
      }
      resolve(mockDataSource)
    })
  },

  createDataSource(dataSource: Omit<DataSourceType, 'id'>) {
    return new Promise((resolve, reject) => {
      resolve({
        code: 200,
        message: 'success',
        data: dataSource,
      })
    })
  },

  //-------------------- account
  getAccount() {
    return http.get(`${basePath}/account.json`)
  },

  getAccountById(sourceId: string): Promise<AccountType> {
    return new Promise<AccountType>((resolve, reject) => {
      const mockAccount: AccountType = {
        id: sourceId,
        name: `account` + sourceId,
        type: 'MySQL',
        jdbcUrl: 'http://jdbc:127.0.0.1//3306',
        updateTime: Date.now() + '',
      }
      resolve(mockAccount)
    })
  },
  createAccount(account: Omit<AccountType, 'id'>) {
    return new Promise((resolve, reject) => {
      resolve({
        code: 200,
        message: 'success',
        data: account,
      })
    })
  },

  async query(query: string = '') {
    const res = await http.get(`${basePath}/folderTree.json`)
    const result: any[] = []
    const search = (nodeItem: any) => {
      if (!nodeItem) return
      const target = nodeItem.name || ''
      if (target.includes(query) || query.includes(target)) {
        result.push(nodeItem)
      }
      if (nodeItem.children) {
        nodeItem.children.forEach((item: any) => {
          search(item)
        })
      }
    }
    search(res.data)

    return result
  },
}

export default api
