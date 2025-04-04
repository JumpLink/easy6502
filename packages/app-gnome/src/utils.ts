export const findIdsInXml = (prefix: string, xmlString: string): string[] => {
  const regex = new RegExp(`id="${prefix}(\\d+)"`, 'g');
  const result: string[] = [];
  let match;

  while ((match = regex.exec(xmlString)) !== null) {
    result.push(`${prefix}${match[1]}`);
  }

  return result;
}
