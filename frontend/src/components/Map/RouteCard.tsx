type Props = {
    index: number;
    distance: number;
    isSelected: boolean;
    onClick: () => void;
    onSave: () => void;
};

const RouteCard: React.FC<Props> = ({ index, distance, isSelected, onClick, onSave }) => {
    return (
        <div
            id={`route-card-${index}`}
            onClick={onClick}
            className={`min-w-[260px] cursor-pointer bg-white rounded-2xl shadow-md p-4 space-y-2 border transition-transform duration-200 text-center ${
                isSelected
                    ? 'border-green-500 ring-2 ring-green-300 scale-105 z-10'
                    : 'border-gray-200 scale-100'
            }`}
        >
            <p className="text-sm text-gray-700 font-semibold">ルート{index + 1}</p>
            <p className="text-base text-gray-800 font-bold">
                {distance != null ? `${distance.toFixed(1)} km` : '---'}
            </p>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // カードクリックと区別
                    onSave();
                }}
                className="min-w-[140px] mx-auto py-2 px-4 text-sm text-white font-semibold rounded-full bg-orange-400 hover:bg-orange-700 shadow-md hover:shadow-lg transition duration-200 ease-in-out"
            >
                このルートを選択
            </button>
        </div>
    );
};

export default RouteCard;
