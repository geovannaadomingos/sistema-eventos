import { forwardRef } from 'react';
import clsx from 'clsx';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            'w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer',
            error && 'border-error',
            className
          )}
          {...props}
        />
        {label && (
          <label className="ml-2 block text-sm text-gray-900 cursor-pointer">
            {label}
          </label>
        )}
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
