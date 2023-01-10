import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
// Hooks
import { useClickExept } from '../../../hooks/useClickExept';
// Utils
import { convertInString } from '../../../Utils/js/сonvert';
import { animateStyles } from '../../../Utils/react/animateStyles';
// Components
import Icon from '../Icon/Icon';
// Styles-module
import styles from './modal.module.scss';
// Types
interface IModalProps {
  isOpen: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  children: React.ReactNode;
  cssClass?: {
    main?: string;
    content?: string;
  };
  cssStyle?: {
    main?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  cancel?: boolean | string;
}

const Modal: React.FC<IModalProps> = ({
  isOpen,
  setOpen,
  children,
  cssClass,
  cssStyle,
  cancel,
}) => {
  // React Ref
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const closeModal = () =>
    animateStyles(modalRef.current, setOpen, styles.modal__close);
  // Castom Hook
  useClickExept(modalContentRef.current, closeModal, !isOpen);

  const node = document.getElementById('root-modal');
  if (!node) return null;

  return ReactDOM.createPortal(
    isOpen && (
      <div
        ref={modalRef}
        className={convertInString(styles.modal, cssClass?.main)}
        style={cssStyle?.main}
      >
        <div
          ref={modalContentRef}
          className={convertInString(styles.modal__content, cssClass?.content)}
          style={cssStyle?.content}
        >
          <button
            className={styles['modal__btn-close']}
            aria-label="Закрыть модальное окно"
            onClick={closeModal}
            children={<Icon active="close" size={15} />}
          />
          {children}
          {cancel && (
            <button
              className={styles['modal__btn-cancel']}
              onClick={closeModal}
              children={typeof cancel === 'string' ? cancel : 'Oтмена'}
            />
          )}
        </div>
      </div>
    ),
    node
  );
};

export default Modal;
