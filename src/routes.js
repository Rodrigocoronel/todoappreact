import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('./views/Dash'),
  loading: Loading,
});

const NuevaBotella = Loadable({
  loader: () => import('./views/Botellas/Registro'),
  loading: Loading,
});
const BusquedaDeBotellas = Loadable({
  loader: () => import('./views/Botellas/Busquedas'),
  loading: Loading,
});

const ControlDeAlmacenes = Loadable({
  loader: () => import('./views/Almacenes'),
  loading: Loading,
});

const Movimientos = Loadable({
  loader: () => import('./views/Movimientos/Traspasos'),
  loading: Loading,
});
const ReporteDeMovimientos = Loadable({
  loader: () => import('./views/Movimientos/Busquedas'),
  loading: Loading,
});

const ControlDeUsuarios = Loadable({
  loader: () => import('./views/Usuarios'),
  loading: Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/app/', exact: true, name: 'Home', component: DefaultLayout },         // Login
  { path: '/app/dashboard', name: 'Dash', component: Dashboard },                 // Ventana principal
  { path: '/app/agregarBotellas', name: 'Dash', component: NuevaBotella },        // Modulo para agregar botellas en secuencia
  { path: '/app/buscarBotellas', name: 'Dash', component: BusquedaDeBotellas },   // Busqueda de botellas registradas
  { path: '/app/almacenes', name: 'Dash', component: ControlDeAlmacenes },        // Registro de almacenes
  { path: '/app/traspasos', name: 'Dash', component: Movimientos },               // Traspazos entre almacenes
  { path: '/app/reportes', name: 'Dash', component: ReporteDeMovimientos },       // Reporte de movimiento de productos
  { path: '/app/usuarios', name: 'Dash', component: ControlDeUsuarios },          // Registro de usuarios
];

export default routes;
