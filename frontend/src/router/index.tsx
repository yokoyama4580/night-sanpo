import type { RouteObject } from "react-router-dom";
import MapView from "../pages/MapView";
import NewDiary from "../pages/NewDiary";
import DiaryList from "../pages/DiaryList";
import DiaryDetail from "../pages/DiaryDetail";
import EditDiary from "../pages/EditDiary";
import NewDiaryComplete from "../pages/NewDiaryComplete";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <DiaryList />
    },
    {
        path: "/new",
        element: <NewDiary />
    },
    {
        path: '/view/:id',
        element: <DiaryDetail />
    },
    {
        path: '/edit/:id',
        element: <EditDiary />,
    },
    {
        path: "/new/completed",
        element: <NewDiaryComplete />
    },
    {
        path: "/map",
        element: <MapView />
    }
];

export default routes;
