import React, { useState } from 'react';
// Redux
import { useAppSelector } from '../../redux/hooks';
// Router
import { Link } from 'react-router-dom';
// Utils
import { colorTheme } from '../../Utils/react/activeColor';
// Components
import { Switch } from './Switch';
import { Setting } from './Setting';
import Modal from '../Common/Modal';
import Icon from '../Common/Icon/Icon';
import IconLogo from '../Common/Icon/IconLogo';
// Styles-module
import styles from './header.module.scss';

export function Header() {
  // Redux
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  // React State
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header
      className={styles.header}
      style={{ backgroundColor: colorTheme(themeLight ? 100 : 17) }}
    >
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <IconLogo />
          pomodoro_box
        </Link>
        <div className={styles.nav__box}>
          <Link to="?p=statistics" className={styles.statistics}>
            <Icon active="statistics" size={16} />
            Статистика
          </Link>
          <button
            className={styles['setting__btn-open']}
            onClick={() => setModalOpen(true)}
          >
            <Icon
              active="setting"
              size={20}
              fill={colorTheme(themeLight ? 0 : 100)}
            />
            Настройки
          </button>
        </div>
      </nav>
      <Modal
        isOpen={modalOpen}
        setOpen={setModalOpen}
        children={
          <>
            <Switch />
            <Setting />
          </>
        }
        cssClass={{
          content: styles['setting__modal-content'],
        }}
        cssStyle={{
          content: { backgroundColor: colorTheme(themeLight ? 100 : 17) },
        }}
      />
    </header>
  );
}
