import React from 'react';
// import { Route, Switch } from 'react-router-dom';
import Home from '../pages/home';
import Login from '../pages/user/login';
import Oauth from '../pages/user/oauth';
import Profile from '../pages/user/profile';
import DicomManage from '../pages/dicom/dicomManage';
import DicomUploader from '../pages/dicom/components/DicomUploader';
import DicomViewer from '../pages/dicom/components/DicomViewer';
import ExamIndexManage from '../pages/dicom/examIndexManage';

const routes = [
    {
        name: 'home',
        path: '/',
        exact: true,
        component: Home,
        routes: [],
    },
    {
        name: 'login',
        path: '/login',
        exact: true,
        component: Login,
        routes: [],
    },
    {
        name: 'oauth',
        path: '/oauth',
        exact: true,
        component: Oauth,
        routes: [],
    },
    {
        name: 'profile',
        path: '/profile',
        exact: true,
        component: Profile,
        routes: [],
    },
    {
        name: 'exam index',
        path: '/exam',
        exact: true,
        component: ExamIndexManage,
        routes: [],
    },
    {
        name: 'dicom',
        path: '/dicom',
        exact: false,
        component: DicomManage,
        routes: [
            {
                name: 'dicom upload',
                path: '/dicom/upload',
                exact: true,
                component: DicomUploader,
            },
            {
                name: 'dicom viewer',
                path: '/dicom/viewer',
                exact: true,
                component: DicomViewer,
            },
        ]
    },
];

export default routes;
