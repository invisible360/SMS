import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import EntryStudents from "../pages/EntryStudents/EntryStudents";
import Home from "../pages/Home/Home";
import RegularAttendance from "../pages/RegularAttendance/RegularAttendance";
import SeeBatchReport from "../pages/SeeBatchReport/SeeBatchReport";
import ViewStudentList from "../pages/ViewStudentList/ViewStudentList";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Main></Main>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/regularAttendance',
                element: <RegularAttendance></RegularAttendance>
            },
            {
                path: '/entryStudent',
                element: <EntryStudents></EntryStudents>
            },
            {
                path: '/viewStudentList',
                element: <ViewStudentList></ViewStudentList>
            },
            {
                path: '/seeBatchReport',
                element: <SeeBatchReport></SeeBatchReport>
            }
        ]
    }
])