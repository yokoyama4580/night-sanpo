import React from 'react';

export type ThemeType = 'safety' | 'scenic' | 'comfort';

export type ThemeButtonProps = {
    type: ThemeType;
    label: string;
    selected: boolean;
    onClick: (type: ThemeType) => void;
    themeProps: {
        border: string;
        bg: string;
        text: string;
        focus: string;
        activeBg: string;
    };
};

const ThemeButton: React.FC<ThemeButtonProps> = ({
    type, label, selected, onClick, themeProps
}) => (
    <button
        type="button"
        onClick={() => onClick(type)}
        className={`
            px-8 py-3 rounded-full text-lg font-bold outline-none border-2 transition
            ${selected
                ? `${themeProps.border} ${themeProps.activeBg} text-white scale-105 ${themeProps.focus}`
                : `${themeProps.border} ${themeProps.bg} ${themeProps.text} hover:bg-opacity-80 hover:shadow-md ${themeProps.focus}`}
        `}
        aria-pressed={selected}
    >
        {label}
    </button>
);

export default ThemeButton;
