import { defineStore } from 'pinia';
import { getToken } from '@coveyz/utils';
import { getInfo } from '../../api/user';

export type UserType = {
  token: string | null,
  name: string,
  account: string,
  avatar: string,
  roles: string[],
  permissions: any[]
}

export type UserInfoType = {
  roles: string[],
  permissions: string[],
  data: any
}

export const useUserStore = defineStore('brick-user', {
  state: (): UserType => ({
    token: getToken(),
    name: '',
    account: '', //todo delete
    avatar: '',
    roles: [],
    permissions: []
  }),
  actions: {
    GetInfo() {
      return new Promise<UserInfoType>((resolve, reject) => {
        getInfo().then(res => {
          const user = res.data.user
          if (res.data.roles && res.data.roles.length) {
            this.roles = res.data.roles;
          }
          if (res.data.permissions && res.data.permissions) {
            this.roles = ['ROLE_DEFAULT']
          }
          this.permissions = res.data.permissions
          this.name = user.name;
          this.account = user.name;
          this.account = user.account;
          resolve(res.data);
        })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
})