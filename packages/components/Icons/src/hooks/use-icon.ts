import { defineComponent, h } from 'vue';
import iconifyIconOnline from '../iconifyIconOnline';

export interface iconType {
  width?: string | number,
  height?: string | number,
  color?: string,
  style?: object
}

const defaultAttrs = {
  width: '20',
  height: '20'
}

export const useRenderIcon = (icon: any, attrs?: iconType) => {
  if (typeof icon === 'function' || typeof icon?.render === 'function') {
    return icon
  }
  else {
    const newAttrs = { ...defaultAttrs, attrs };

    return defineComponent({
      name: "Icon",
      render() {
        return h(iconifyIconOnline, {
          icon,
          ...newAttrs
        });
      }
    })
  }
}