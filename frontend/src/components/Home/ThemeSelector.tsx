import React from 'react';
import ThemeButton from './ThemeButton';
import type { ThemeType } from './ThemeButton';

type ThemeSelectorProps = {
    selected: ThemeType[];
    onSelect: (type: ThemeType) => void;
    themeTypes: ThemeType[];
    themeLabels: Record<ThemeType, string>;
    themeProps: Record<ThemeType, {
        border: string;
        bg: string;
        text: string;
        focus: string;
        activeBg: string;
    }>;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    selected, onSelect, themeTypes, themeLabels, themeProps
}) => (
    <div className="flex gap-4 flex-wrap justify-center">
        {themeTypes.map(type => (
            <ThemeButton
                key={type}
                type={type}
                label={themeLabels[type]}
                selected={selected.includes(type)}
                onClick={onSelect}
                themeProps={themeProps[type]}
            />
        ))}
    </div>
);

export default ThemeSelector;
