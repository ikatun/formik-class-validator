import { keys } from 'lodash';

export function resolvePath(path: string, args) {
  let resultingPath = path;
  for (const key of keys(args)) {
    const value = args[key];
    resultingPath = resultingPath.replace(`:${key}`, value);
  }

  return resultingPath;
}
