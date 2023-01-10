import React, { useRef } from 'react';
// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { themeChange } from '../../../redux/slices/settingPomodoroSlice';
// Utils
import { colorTheme } from '../../../Utils/react/activeColor';
// Components
import Icon from '../../Common/Icon/Icon';
// Styles-module
import styles from './switch.module.scss';

export function Switch() {
  // Redux
  const dispatch = useAppDispatch();
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  // React Ref
  const labelRef = useRef<HTMLLabelElement>(null);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const styleLabel = labelRef.current?.classList;
    styleLabel?.add(styles['switch__label-hidden']);
    dispatch(themeChange(e.currentTarget.checked));
    setTimeout(() => styleLabel?.remove(styles['switch__label-hidden']), 390);
  };

  return (
    <div className={styles.switch__container}>
      <h3 className={styles.switch__title}>Выбор темы</h3>
      <div className={styles.switch__box}>
        <label
          ref={labelRef}
          htmlFor="switch"
          className={styles.switch__label}
          children={`${themeLight ? 'Светлая' : 'Тёмная'} тема`}
        />
        <div
          className={styles.switch__slider}
          style={{
            backgroundColor: colorTheme(themeLight ? 10 : 100),
          }}
        >
          <input
            id="switch"
            className={styles.switch__input}
            type="checkbox"
            onChange={handleChangeInput}
            checked={!themeLight}
          />
          <div
            className={styles.switch}
            style={{
              backgroundColor: colorTheme(themeLight ? 100 : 10),
            }}
          >
            <Icon
              active={themeLight ? 'sun' : 'moon'}
              size={20}
              fill={colorTheme(themeLight ? 0 : 100)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
