import { ClassNameFormatter, cn, NoStrictEntityMods } from '@bem-react/classname';

const classname = (
  classes: Record<string, string>,
  blockName: string,
  elemName?: string | undefined,
): ClassNameFormatter => {
  const cx = cn(blockName, elemName);
  return <T extends NoStrictEntityMods | null | undefined>(...args: T[]) =>
    cx(...args)
      .split(' ')
      .reduce((prev, curr) => {
        return prev + ' ' + classes[curr];
      }, '');
};

export default classname;
