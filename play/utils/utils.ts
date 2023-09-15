export const kebabCase = (key: string) => {
  const result = key.replace(/([A-Z])/g, ' $1').trim();

  return result.split(' ').join('-').toLocaleLowerCase();
}