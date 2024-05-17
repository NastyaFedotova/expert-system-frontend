import React, { HTMLInputTypeAttribute, memo, useCallback, useEffect, useRef, useState } from 'react';

import { ArrowDownIcon } from '@/icons';
import { classname } from '@/utils';

import { useClickOutside } from '../../hooks/useClickOutside';
import Input from '../Input';
import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './Dropdown.module.scss';

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  label: string;
  /** Значение варианта, отображается пользователю */
  value: string | number | boolean;
};

/** Пропсы, которые принимает компонент Dropdown */
export type DropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option;
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;

  placeholder?: string;

  onlyInput?: boolean;
  withInput?: boolean;

  label?: string;
  inputType?: HTMLInputTypeAttribute;
};

const cnDropdown = classname(classes, 'dropdown');

const Dropdown: React.FC<DropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled,
  placeholder,
  onlyInput,
  withInput,
  inputType,
  label,
}) => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOnClickInput = useCallback(() => {
    if (!disabled) {
      setPopoverVisible((prev) => !prev);
    }
  }, [disabled]);

  const handleOnClickOutside = useCallback(() => {
    setPopoverVisible(false);
  }, []);

  useClickOutside(dropdownRef, handleOnClickOutside);

  const handleOnClickOption = useCallback(
    (newOption: Option) => () => {
      onChange(newOption);
      setPopoverVisible(false);
    },
    [onChange],
  );

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const currentValue = event.currentTarget.value;
      const valueTryFind = options.find((option) => option.label === currentValue)?.value;
      onChange({ label: currentValue, value: valueTryFind ?? currentValue });
    },
    [onChange, options],
  );

  useEffect(() => {
    if (disabled) {
      setPopoverVisible(false);
    }
  }, [disabled]);

  return (
    <div className={cnDropdown({ disabled }) + ` ${className}`} ref={dropdownRef}>
      {onlyInput || withInput ? (
        <Input
          defaultValue={value.label}
          afterSlot={
            <>
              {!onlyInput && (
                <ArrowDownIcon
                  onClick={handleOnClickInput}
                  color="secondary"
                  className={cnDropdown('arrow', { popoverVisible })}
                />
              )}
            </>
          }
          label={label ? (label?.length > 32 ? label.slice(0, 29).concat('...') : label) : ''}
          labelTitle={label}
          placeholder="Введите ответ"
          onClick={handleOnClickInput}
          onChange={handleOnChange}
          className={cnDropdown('inputSlot', { textCursor: onlyInput || withInput })}
          type={inputType}
        />
      ) : (
        <div
          className={cnDropdown('input', { disabled, placeholder: !value.label?.length })}
          onClick={handleOnClickInput}
        >
          <div className={cnDropdown('label', { visible: !!label })} title={label}>
            {label ? (label?.length > 32 ? label.slice(0, 29).concat('...') : label) : ''}
          </div>
          <Text className={cnDropdown('input-value')} maxLines={1}>
            {value.label?.length ? value.label : placeholder}
          </Text>
          <ArrowDownIcon color="secondary" className={cnDropdown('arrow', { popoverVisible })} />
        </div>
      )}

      {popoverVisible && !disabled && (
        <div className={cnDropdown('options')}>
          {options.map((option, optionIndex) => (
            <span key={optionIndex} onClick={handleOnClickOption(option)}>
              <Text
                tag={TEXT_TAG.div}
                view={TEXT_VIEW.p16}
                className={cnDropdown('option')}
                color={value.value === option.value ? 'accent' : 'primary'}
              >
                {option.label}
              </Text>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(Dropdown);
