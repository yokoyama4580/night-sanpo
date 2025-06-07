// components/Diary/DiaryMenu.tsx
import React from 'react';

type Props = {
    onEdit: () => void;
    onDelete: () => void;
};

const DiaryMenu: React.FC<Props> = ({ onEdit, onDelete }) => (
    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
        <button
            onClick={onEdit}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
            編集
        </button>
        <button
            onClick={onDelete}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
            削除
        </button>
    </div>
);

export default DiaryMenu;
