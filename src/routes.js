import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Cargando...</div>;
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
  loader: () => import('./views/Usuarios/Registro'),
  loading: Loading,
});

const Logout = Loadable({
  loader: () => import('./views/Usuarios/Registro'),
  loading: Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/app/', exact: true, name: 'Ingresar', component: DefaultLayout },         // Login
  { path: '/app/dashboard', name: 'Inicio', component: Dashboard },                 // Ventana principal
  { path: '/app/agregarBotellas', name: 'Agregar', component: NuevaBotella },        // Modulo para agregar botellas en secuencia
  { path: '/app/buscarBotellas', name: 'Buscar', component: BusquedaDeBotellas },   // Busqueda de botellas registradas
  { path: '/app/almacenes', name: 'Almacenes', component: ControlDeAlmacenes },        // Registro de almacenes
  { path: '/app/traspasos', name: 'Traspasos', component: Movimientos },               // Traspazos entre almacenes
  { path: '/app/reportes', name: 'Reportes', component: ReporteDeMovimientos },       // Reporte de movimiento de productos
  { path: '/app/Registro', name: 'Usuarios', component: ControlDeUsuarios },          // Registro de usuarios
  { path: '/app/Logout', name: 'Logout', component: Logout },          // Registro de usuarios
];

export default routes;
