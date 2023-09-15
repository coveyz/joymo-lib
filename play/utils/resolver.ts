import { kebabCase } from './utils'

const getSideEffects = (dirName: any, options = {}) => {
  console.log('dirName=>', dirName)
  return [
    'joymo-lib/es/components/base/style/index',
    `joymo-lib/es/components/${dirName}/style/index`,
  ]

}


const resolveComponent = (name: string, options = {}) => {
  if (!name.match(/^J[A-Z]/)) {
    return
  }

  console.log('name=.', kebabCase(name))
  console.log('partialName=.', kebabCase(name).slice(2))

  const partialName = kebabCase(name).slice(2);

  return {
    name,
    from: `joymo-lib/es`,
    sideEffects: getSideEffects(partialName),
  }
}



export const joymoLibResolver = (options = {}) => {
  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        console.log('joymoLibResolver-components=>', name);
        return resolveComponent(name)
      }
    }
  ]
}
