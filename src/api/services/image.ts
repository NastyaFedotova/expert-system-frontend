import { getApiRequest } from '..';

export const getImage = async (url: string): Promise<File> => {
  const { data } = await getApiRequest<Blob>(url);

  const imageName = new RegExp(/(?<=\/images\/).*/);
  const type = new RegExp(/(?<=\.).*/);

  const file = new File([data], imageName.exec(url)?.[0] ?? 'image.png', {
    type: data.type ?? `image/${type.exec(url)?.[0] ?? 'png'}`,
  });

  return file;
};
