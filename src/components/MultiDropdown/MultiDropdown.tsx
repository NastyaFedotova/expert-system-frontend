import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ArrowDownIcon } from '@/icons';
import { classname } from '@/utils';

import { useClickOutside } from '../../hooks/useClickOutside';
import Input from '../Input';
import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './MultiDropdown.module.scss';

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
};

const cnMultiDropdown = classname(classes, 'multidropdown');

const MultiDropdown: React.FC<MultiDropdownProps> = ({ className, options, value, onChange, disabled, getTitle }) => {
  const [inputValue, setInputValue] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = useMemo(() => getTitle(value), [getTitle, value]);

  const filteredOptions = useMemo(() => {
    const optionsFilter = new RegExp(`^(${inputValue})`, 'm');
    return options.filter((option) => optionsFilter.test(option.value));
  }, [inputValue, options]);

  const handleOnChange = useCallback((target: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(target.currentTarget.value);
  }, []);

  const handleOnClickInput = useCallback(() => {
    if (!disabled) {
      setPopoverVisible(true);
    }
  }, [disabled]);

  const handleOnClickOutside = useCallback(() => {
    setPopoverVisible(false);
    setInputValue('');
  }, []);

  useClickOutside(dropdownRef, handleOnClickOutside);

  const handleOnClickOption = useCallback(
    (newOption: Option) => () => {
      if (value.some((option) => option.key === newOption.key)) {
        onChange(value.filter((option) => option.key !== newOption.key));
      } else {
        onChange([...value, newOption]);
      }
    },
    [onChange, value],
  );

  useEffect(() => {
    if (disabled) {
      setPopoverVisible(false);
    }
  }, [disabled]);

  return (
    <div className={cnMultiDropdown() + ` ${className}`} ref={dropdownRef}>
      <Input
        value={popoverVisible ? inputValue : value.length ? title : ''}
        onChange={handleOnChange}
        afterSlot={
          <ArrowDownIcon onClick={handleOnClickInput} color="secondary" className={cnMultiDropdown('arrow')} />
        }
        disabled={disabled}
        ref={inputRef}
        onClick={handleOnClickInput}
        placeholder={title}
      />
      {popoverVisible && !disabled && (
        <div className={cnMultiDropdown('options')}>
          {filteredOptions.map((option) => (
            <span key={option.key} onClick={handleOnClickOption(option)}>
              <Text
                tag={TEXT_TAG.div}
                view={TEXT_VIEW.p16}
                className={cnMultiDropdown('option')}
                color={title.includes(option.value) ? 'accent' : 'primary'}
              >
                {option.value}
              </Text>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
