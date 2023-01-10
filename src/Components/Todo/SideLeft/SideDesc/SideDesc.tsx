import React from 'react';
// Static data
import { DESC } from '../../../Common/static';
// Styles-module
import styles from './sidedesc.module.scss';

export function SideDesc() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ура! Теперь можно начать работать:</h2>
      <ul className={styles.desc__list}>
        {DESC.map(({ id, desc }) => (
          <li key={id} className={styles.desc__item}>
            <p className={styles.desc}>{desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
