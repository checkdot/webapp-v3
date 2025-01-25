import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    customHeader?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, customHeader }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {customHeader}
                {children}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Modal; 