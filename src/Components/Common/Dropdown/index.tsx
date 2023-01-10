import React, { useState, useEffect, useRef } from 'react';
// Hooks
import { useClickExept } from '../../../hooks/useClickExept';
// Utils
import { animateStyles } from '../../../Utils/react/animateStyles';
// Styles-module
import styles from './dropdown.module.scss';
// Types
interface IDropdownProps {
  button: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const Dropdown: React.FC<IDropdownProps> = ({
  button,
  children,
  isOpen = false,
  onOpen = () => {},
  onClose = () => {},
}) => {
  // React State
  const [open, setOpen] = useState(isOpen);
  // Event Open&Close
  const handleOpen = () => (open ? handleClose() : setOpen(true));
  const handleClose = () =>
    animateStyles(dropdownRef.current, setOpen, styles.dropdown__close);
  // React Ref
  const dropdownBoxRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // React Effect
  useEffect(() => setOpen(isOpen), [isOpen]);
  useEffect(() => (open ? onOpen() : onClose()), [open]);
  // Castom Hook
  useClickExept(dropdownBoxRef.current, handleClose);

  return (
    <div ref={dropdownBoxRef} className={styles.container}>
      <div onClick={handleOpen}>{button}</div>
      {open && (
        <div ref={dropdownRef} className={styles.dropdown__container}>
          <div
            className={styles.dropdown}
            onClick={handleClose}
            children={children}
          />
        </div>
      )}
    </div>
  );
};

export default Dropdown;
