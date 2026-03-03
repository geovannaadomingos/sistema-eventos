import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
}

export default function Card({ children, className, header, footer }: CardProps) {
    return (
        <div className={clsx('card-base', className)}>
            {header && (
                <div className="px-6 py-4 border-b border-gray-100">
                    {header}
                </div>
            )}
            <div className="px-6 py-4">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {footer}
                </div>
            )}
        </div>
    );
}
