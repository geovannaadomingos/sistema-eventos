import type { ReactNode } from 'react';
import clsx from 'clsx';

interface TableColumn<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, row: T) => ReactNode;
    className?: string;
    sortable?: boolean;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    keyExtractor: (row: T, index: number) => string | number;
    rowClassName?: (row: T) => string;
    emptyMessage?: string;
    hoverable?: boolean;
}

export default function Table<T>({
    columns,
    data,
    keyExtractor,
    rowClassName,
    emptyMessage = 'Nenhum registro encontrado',
    hoverable = true,
}: TableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="card-base p-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto card-base">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={clsx(
                                    'px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider',
                                    column.className
                                )}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((row, idx) => (
                        <tr
                            key={keyExtractor(row, idx)}
                            className={clsx(
                                hoverable && 'hover:bg-gray-50 transition-colors',
                                rowClassName?.(row)
                            )}
                        >
                            {columns.map((column) => {
                                const value = column.key !== 'actions' ? (row as any)[column.key] : null;
                                const cellContent = column.render ? column.render(value, row) : value;

                                return (
                                    <td
                                        key={String(column.key)}
                                        className={clsx('px-6 py-4 text-sm text-gray-900', column.className)}
                                    >
                                        {cellContent}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
