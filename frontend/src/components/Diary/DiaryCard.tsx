// components/Diary/DiaryCard.tsx
import React from 'react';
import DiaryMenu from './DiaryMenu';
import type { Diary } from '../../types';

type Props = {
    diary: Diary;
    isMenuOpen: boolean;
    onClickBody: () => void;
    onToggleMenu: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

const DiaryCard: React.FC<Props> = ({ diary, isMenuOpen, onClickBody, onToggleMenu, onEdit, onDelete }) => {
    const dateObj = new Date(diary.created_at);
    const day = dateObj.getDate();
    const weekday = ['日','月','火','水','木','金','土'][dateObj.getDay()];

    return (
        <div className="relative flex bg-white p-4 rounded-2xl shadow-sm items-start gap-4">
            <div className="flex flex-col items-center justify-center w-16 text-teal-500 font-bold shrink-0">
                <div className="text-sm">{weekday}</div>
                <div className="text-2xl">{day}</div>
            </div>
            <div className="flex-1 cursor-pointer pr-12" onClick={onClickBody}>
                <div className="font-semibold text-gray-800 line-clamp-1 mb-1">{diary.text.split('\n')[0]}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{diary.text}</div>
            </div>
            <div className="absolute top-2.5 right-2">
                <button
                    onClick={onToggleMenu}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
                >
                    <span className="text-lg font-bold">⋮</span>
                </button>
                {isMenuOpen && (
                    <DiaryMenu onEdit={onEdit} onDelete={onDelete} />
                )}
            </div>
        </div>
    );
};

export default DiaryCard;
