import { onMounted, toRefs, reactive, onBeforeUnmount } from 'vue'
import { throttleAndDebounce } from '@coveyz/utils'
import type { searchWrapperType } from '../Panel/default'

export const useWrapper = () => {
  const wrapperState: searchWrapperType = reactive({
    id: `SearchWrapper${Math.floor(Math.random() * 1000)}`,
    hidden: true,
    showHiddenBtn: false,
  })


  /** @description 计算屏幕宽度  */
  const getScreenWidth = () => {
    return document.documentElement.clientWidth || document.body.clientWidth;
  }

  /** @description 计算当前一列展示多少个  */
  const getColumnNum = () => {
    let colNum = 0, w = getScreenWidth();
    if (w <= 1440) {
      colNum = 4
    } else if (w > 1440 && w <= 1920) {
      colNum = 5
    } else {
      colNum = 6
    }
    return colNum;
  }

  /** @description 获取当前 form 下有几个formItem  */
  const getFormItemNum = () => {
    const formDom = document.querySelector(`#${wrapperState['id']} form`),
      formItems = Array.from(formDom?.childNodes ?? []).filter(item => item.nodeName !== '#text') as HTMLElement[];

    let formItemNumber = 0;

    formItems.forEach(item => {
      let curItemColNumber = item.getAttribute('col') || 1;
      formItemNumber += Number(curItemColNumber);
    })

    // console.log('formItemNumber=>', formItemNumber)
    return formItemNumber
  }

  /** @description resize  */
  const onResize = () => {
    const colNumber = getColumnNum(), formItemNumber = getFormItemNum();
    wrapperState['showHiddenBtn'] = wrapperState['hidden'] = formItemNumber > 2 * colNumber;

    // console.log('formItemNumber=>', formItemNumber, 'colNumber=>', colNumber)
    // console.log('showHiddenBtn=>', wrapperState['showHiddenBtn'], 'hidden=>', wrapperState['hidden'],)
  }

  const toggle = () => {
    wrapperState.hidden = !wrapperState.hidden
  }

  const throttleResize = throttleAndDebounce(onResize, 300)

  onMounted(() => {
    onResize();
    window.addEventListener('resize', throttleResize);
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', throttleResize);
  })

  return {
    ...toRefs(wrapperState),
    toggle
  }
}