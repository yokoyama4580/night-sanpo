import type { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import MapView from "../pages/MapView";
import LoadingScreen from "../components/Common/LoadingScreen";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/loading",
        element: <LoadingScreen />
    },
    {
        path: "/map",
        element: <MapView />
    }
];

export default routes;
