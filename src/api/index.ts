// 数据
import axios from 'axios'
import http from '../common/http'
import {
  IFolderTree,
  IFolderTreeNodeProps,
} from '@dtinsight/molecule/esm/model'

const basePath = './mock'

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
        'http://localhost:3001/user-project-json',
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
