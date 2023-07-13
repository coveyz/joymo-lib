import { defineStore } from 'pinia';
import setting from '../../config';

const { brandMdCode } = setting

export type configStateType = {
  key: string,
  value: any
}


export const useSettingStore = defineStore('brick-setting', {
  state: () => ({
    brandMdCode
  }),
  actions: {
    changeSetting(data: configStateType) {
      const { key, value } = data
      if (key in this) {
        //@ts-ignore
        this[key] = value
      }
    }
  }
});