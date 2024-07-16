// 文件导航栏：详情列表的 UI
import React from 'react'

export type AccountDetailProps = {
  account?: Partial<AccountType>
}

const styledTable = {
  margin: 10,
  display: 'block',
}

export function AccountDetail({ account = {} }: AccountDetailProps) {
  const { name, type, jdbcUrl, updateTime } = account
  return (
    <div className="account__detail">
      <table style={styledTable}>
        <tr>
          <td>Name:</td>
          <td>{name}</td>
        </tr>
        <tr>
          <td>Type:</td>
          <td>{type}</td>
        </tr>
        <tr>
          <td>JdbcUrl:</td>
          <td>{jdbcUrl}</td>
        </tr>
        <tr>
          <td>Update Time:</td>
          <td>{updateTime}</td>
        </tr>
      </table>
    </div>
  )
}

export default AccountDetail
