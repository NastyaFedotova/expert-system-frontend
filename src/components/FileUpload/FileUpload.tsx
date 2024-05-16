import React, { memo, useCallback, useRef, useState } from 'react';
import Image from 'next/image';

import CloseIcon from '@/icons/CloseIcon';
import UploadIcon from '@/icons/UploadIcon';
import { classname, imageUrl } from '@/types/utils';

import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './FileUpload.module.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  initialImageUrl?: string;
  onDeleteClick?: () => void;
};

const cnFileUpload = classname(classes, 'file-upload');

const MAX_SIZE = 1024 * 1024;

const FileUpload = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onChange, onDeleteClick, initialImageUrl, ...props }, ref) => {
    const [initImage, setInitImage] = useState(!!initialImageUrl);
    const [imagePreview, setImagePreview] = useState('');
    const [isError, setIsError] = useState(false);
    const labelInput = useRef<HTMLLabelElement>(null);
    const handleOnChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        setIsError(false);
        const image = event.target.files?.[0];

        if (image) {
          if (image.size >= MAX_SIZE) {
            setIsError(true);
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
            setInitImage(false);
          };

          reader.readAsDataURL(image);
        }
      },
      [onChange],
    );

    const deleteImage = useCallback(() => {
      setImagePreview('');
      setInitImage(false);
      onDeleteClick?.();
    }, [onDeleteClick]);

    return (
      <div className={cnFileUpload({ uploaded: !!imagePreview || initImage }) + ` ${className}`}>
        {imagePreview || initImage ? (
          <Image
            src={initImage && initialImageUrl ? imageUrl(initialImageUrl) : imagePreview}
            alt={'Upload Image'}
            width={200}
            height={200}
            style={{
              objectFit: 'cover',
            }}
            quality={100}
            className={cnFileUpload('image')}
          />
        ) : (
          <>
            <div className={cnFileUpload('label')}>Изображение</div>
            <div className={cnFileUpload('background')}>
              <UploadIcon width={140} height={140} />
              <Text tag={TEXT_TAG.div} view={TEXT_VIEW.p16} className={cnFileUpload('text', { error: isError })}>
                {`${isError ? 'Превышен макс.' : 'Макс.'} размер - ${MAX_SIZE / (1024 * 1024)}МБ`}
              </Text>
            </div>
          </>
        )}
        <label className={cnFileUpload('input-wrapper')} ref={labelInput}>
          <input {...props} ref={ref} type="file" className={cnFileUpload('input')} onChange={handleOnChange} />
        </label>
        {(!!imagePreview || initImage) && <CloseIcon className={cnFileUpload('delete')} onClick={deleteImage} />}
      </div>
    );
  },
);

export default memo(FileUpload);
