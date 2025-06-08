import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

type Props = {
    positions: [number, number][];
};

const ChangeMapBounds: React.FC<Props> = ({ positions }) => {
    const map = useMap();

    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, {
                paddingTopLeft: [50, 50],
                paddingBottomRight: [50, 200],
            });
        }
    }, [positions, map]);

    return null;
};

export default ChangeMapBounds;
