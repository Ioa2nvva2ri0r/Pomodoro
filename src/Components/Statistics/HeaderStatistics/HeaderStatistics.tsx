import React, { useRef } from 'react';
// Redux
import { useAppSelector } from '../../../redux/hooks';
// Utils
import { colorTheme } from '../../../Utils/react/activeColor';
// Components
import Dropdown from '../../Common/Dropdown';
import Icon from '../../Common/Icon/Icon';
// Static-data
import { LISTWEEK } from '../../Common/static';
// Styles-modules
import styles from './headerstatistics.module.scss';
// Types
interface IHeaderStatisticsProps {
  activeWeek: TActiveWeek;
  setActiveWeek: React.Dispatch<React.SetStateAction<TActiveWeek>>;
}

export function HeaderStatistics({
  activeWeek,
  setActiveWeek,
}: IHeaderStatisticsProps) {
  // Redux
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  // React Ref
  const selectRef = useRef<HTMLButtonElement>(null);

  return (
    <header className={styles.header}>
      <h2 className={styles.header__title}>Ваша активность</h2>
      <Dropdown
        button={
          <button
            ref={selectRef}
            className={styles.dropdown__select}
            style={{
              backgroundColor: colorTheme(themeLight ? 96 : 30),
              color: colorTheme(themeLight ? 20 : 100),
            }}
            onClick={(e) =>
              e.currentTarget.classList.toggle(
                styles['dropdown__select-active']
              )
            }
          >
            {LISTWEEK.filter((o) => o.action === activeWeek)[0].children}
            <Icon active="arrow" size={{ width: 16, height: 10 }} />
          </button>
        }
        onClose={() =>
          selectRef.current?.classList.remove(styles['dropdown__select-active'])
        }
        children={
          <ul
            className={styles.dropdown}
            onClick={() =>
              selectRef.current?.classList.remove(
                styles['dropdown__select-active']
              )
            }
          >
            {LISTWEEK.map(
              ({ key, children, action }) =>
                activeWeek !== action && (
                  <li
                    key={key}
                    className={styles.dropdown__item}
                    style={{
                      borderColor: colorTheme(themeLight ? 87 : 30),
                    }}
                  >
                    <button
                      className={styles.dropdown__option}
                      style={{
                        backgroundColor: colorTheme(themeLight ? 96 : 40),
                        color: colorTheme(themeLight ? 20 : 100),
                      }}
                      onClick={() => setActiveWeek(action)}
                      children={children}
                    />
                  </li>
                )
            )}
          </ul>
        }
      />
    </header>
  );
}
