import type { ReactNode } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import clsx from 'clsx';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    title?: string;
    children: ReactNode;
    onClose?: () => void;
    closable?: boolean; className?: string;
}

export default function Alert({
    type,
    title,
    children,
    onClose,
    closable = true,
    className,
}: AlertProps) {
    const config = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: FiCheckCircle,
            iconColor: 'text-green-500',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: FiAlertCircle,
            iconColor: 'text-red-500',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: FiAlertTriangle,
            iconColor: 'text-yellow-500',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: FiInfo,
            iconColor: 'text-blue-500',
        },
    };

    const { bg, border, text, icon: Icon, iconColor } = config[type];

    return (
        <div className={clsx('rounded-lg border p-4 flex gap-3', bg, border, className)}>
            <Icon className={clsx('flex-shrink-0 w-5 h-5 mt-0.5', iconColor)} />
            <div className="flex-1">
                {title && <p className={clsx('font-semibold', text)}>{title}</p>}
                <p className={text}>{children}</p>
            </div>
            {closable && onClose && (
                <button
                    onClick={onClose}
                    className={clsx('flex-shrink-0', text, 'hover:opacity-75 transition-opacity')}
                >
                    <FiX size={18} />
                </button>
            )}
        </div>
    );
}
