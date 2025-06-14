import type { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import MapView from "../components/MapView";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/map",
        element: <MapView />
    }
];

export default routes;
