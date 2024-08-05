import React from 'react'
import molecule from '@dtinsight/molecule'
import styled from 'styled-components'
import { container } from 'tsyringe'

import API from '../../api'
import { FormItem } from '../../components/formItem'
import { existCreateAccountView } from '../../extensions/account/base'
import { NotificationController } from '@dtinsight/molecule/esm/controller'

const Button = molecule.component.Button

const CreateAccount = styled.div`
  width: 50%;
  margin: auto;
`

const CreateDataBtn = styled(Button)`
  width: 120px;
  display: inline-block;
`

export class CreateAccountView extends React.Component {
  state = {
    data: [],
    currentAccount: undefined,
  }

  formRef: React.RefObject<HTMLFormElement>

  constructor(props: any) {
    super(props)
    this.formRef = React.createRef()
  }

  componentDidMount() {}

  submit = async (e: React.FormEvent) => {
    const form = new FormData(this.formRef.current || undefined)
    const account = {
      name: form.get('name')?.toString() || '',
      type: form.get('type')?.toString() || '',
      jdbcUrl: form.get('jdbcUrl')?.toString() || '',
      updateTime: new Date().getTime().toString(),
    }

    API.createAccount(account).then((res: any) => {
      if (res.code === 200) {
        molecule.notification.add([
          {
            id: 2,
            value: account,
            render(item) {
              return (
                <p>
                  Create the Account <b>{item.value.name}</b> is success!
                </p>
              )
            },
          },
        ])
        container.resolve(NotificationController).toggleNotifications()
        // molecule.notification.toggleNotification(); // Invalid
      }
    })
  }

  close = async (e: React.FormEvent) => {
    existCreateAccountView()
  }

  render() {
    return (
      <CreateAccount className="account__create">
        <form ref={this.formRef} onSubmit={this.submit}>
          <FormItem label="Name" name="name" />
          <FormItem label="Type" name="type" />
          <FormItem label="JdbcUrl" name="jdbcUrl" />
          <FormItem style={{ textAlign: 'left' }}>
            <CreateDataBtn style={{ marginLeft: 0 }} onClick={this.submit}>
              Create
            </CreateDataBtn>
            <CreateDataBtn onClick={this.close}>Close</CreateDataBtn>
          </FormItem>
        </form>
      </CreateAccount>
    )
  }
}

export default CreateAccountView
