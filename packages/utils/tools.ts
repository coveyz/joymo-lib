/** 节流 */
export const throttleAndDebounce = (fn: any, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>
  let called = false;

  return () => {
    if (timeout) clearTimeout(timeout);
    if (!called) {
      fn();
      called = true;

      setTimeout(() => {
        called = false;
      }, delay);
    } else {
      timeout = setTimeout(fn, delay);
    }
  }
}




const resolveComponent = (name: string, options: any) => {
  if (name === 'JSearchPanel') {
    return { name: 'JSearchPanel', from: `joymo-lib/lib/components/SearchPanel`, }
  }
}



export const joymoLibResolver = (options: any) => {

  console.log('joymoLibResolver=>', options)


  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        console.log('joymoLibResolver-components=>', name);
        return resolveComponent(name, options)
      }
    }
  ]
}
