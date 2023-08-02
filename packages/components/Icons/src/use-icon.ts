import { defineComponent, h } from 'vue';
import iconifyIconOnline from './iconifyIconOnline';

export interface iconType {
  inline?: boolean,
  width?: string | number,
  height?: string | number,
  color?: string,
  fill: string,
  style?: object
}

const defaultAttrs = {
  width: '20',
  height: '20'
}

export const useRenderIcon = (icon: any, attrs?: iconType) => {
  //* 组件形式
  if (typeof icon === 'function' || typeof icon?.render === 'function') {
    return icon
  }
  //* 其他
  else {
    const newAttrs = { ...defaultAttrs, attrs };

    return defineComponent({
      name: "Icon",
      render() {
        return h(iconifyIconOnline, {
          ...newAttrs
        })
      }
    })
  }
}