import type { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  isDanger?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  isDanger,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                isDanger ? 'bg-red-50' : 'bg-gray-50'
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          )}
          <div className="px-6 py-4">{children}</div>
          {footer && (
            <div className="px-6 py-4 border-t bg-gray-50 flex gap-2 justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
