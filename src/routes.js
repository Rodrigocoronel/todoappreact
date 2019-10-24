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

const CargarFactura = Loadable({
	loader: () => import('./views/Etiquetas/Facturas'),
	loading: Loading,
});

const DestruirEtiqueta = Loadable({
	loader: () => import('./views/Etiquetas/BajaSinLector'),
	loading: Loading,
});

// const NuevaBotella = Loadable({
// 	loader: () => import('./views/Botellas/Registro'),
// 	loading: Loading,
// });

const BusquedaDeBotellas = Loadable({
	loader: () => import('./views/Botellas/Busquedas'),
	loading: Loading,
});

const InventarioDeBotellas = Loadable({
	loader: () => import('./views/Botellas/Inventario'),
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

const EditUser = Loadable({
	loader: () => import('./views/Usuarios/Registro/form.js'),
	loading: Loading,
});

const Logout = Loadable({
	loader: () => import('./views/Usuarios/Logout'),
	loading: Loading,
});

const ListaFactura = Loadable({
	loader: () => import('./views/Etiquetas/Facturas/listado.js'),
	loading: Loading,
});

const EtiquetsRe = Loadable({
	loader: () => import('./views/Etiquetas/ReporteEtiquetasReimpresas.js'),
	loading: Loading,
});

export const routes = [
	{ path: '/app/', 					exact:true, name: 'Ingresar', 		component: DefaultLayout },         // Login
	{ path: '/app/dashboard',       				name: 'Inicio',			component: Dashboard },             // Ventana principal
	{ path: '/app/cargarFacturas',					name: 'Imprimir',		component: CargarFactura },			// Modulo para cargar facturas e imprimir etiquetas
	{ path: '/app/destruirEtiqueta',				name: 'Destruir',		component: DestruirEtiqueta },		// Dar de baja etiqueta sin lector
	{ path: '/app/lista', name: 'facturas', component: ListaFactura },
	// { path: '/app/agregarBotellas', 				name: 'Agregar', 		component: NuevaBotella },          // Modulo para agregar botellas en secuencia
	{ path: '/app/buscarBotellas',  				name: 'Buscar', 		component: BusquedaDeBotellas },    // Busqueda de botellas registradas
	{ path: '/app/inventarioBotellas', 				name: 'Inventario', 	component: InventarioDeBotellas },  // Inventario de botellas por areas
	{ path: '/app/almacenes',       				name: 'Almacenes', 		component: ControlDeAlmacenes },    // Registro de almacenes
	{ path: '/app/traspasos',       				name: 'Traspasos', 		component: Movimientos },           // Traspazos entre almacenes
	{ path: '/app/reportes',        				name: 'Reportes', 		component: ReporteDeMovimientos },  // Reporte de movimiento de productos
	{ path: '/app/registro', 			exact:true, name: 'Usuarios', 		component: ControlDeUsuarios },     // Registro de usuarios
	{ path: '/app/registro/edit/:id', 	exact:true, name: 'Editar Usuario', component: EditUser },	   			// Editar Usuario
	{ path: '/app/registro/agregar', 	exact:true, name: 'Agregar Usuario',component: EditUser },	   			// Agregar Usuario
	{ path: '/app/reimpresas', exact: true, name: 'Etiquetas Reimpresas', component: EtiquetsRe},
	{ path: '/app/logout',          				name: 'Logout',    		component: Logout },                // Logout
];

export const routes_gerente = [
	{ path: '/app/', 					exact:true, name: 'Ingresar', 		component: DefaultLayout },         // Login
	{ path: '/app/dashboard',       				name: 'Inicio',			component: Dashboard },             // Ventana principal
	{ path: '/app/cargarFacturas',					name: 'Imprimir',		component: CargarFactura },			// Modulo para cargar facturas
	{ path: '/app/lista', name: 'facturas', component: ListaFactura },
	{ path: '/app/buscarBotellas',  				name: 'Buscar', 		component: BusquedaDeBotellas },    // Busqueda de botellas registradas
	{ path: '/app/inventarioBotellas', 				name: 'Inventario', 	component: InventarioDeBotellas },  // Inventario de botellas por areas
	{ path: '/app/traspasos',       				name: 'Traspasos', 		component: Movimientos },           // Traspazos entre almacenes
	{ path: '/app/reportes',        				name: 'Reportes', 		component: ReporteDeMovimientos },  // Reporte de movimiento de productos
	{ path: '/app/logout',          				name: 'Logout',    		component: Logout },                // Logout
];

export const routes_barra = [
	{ path: '/app/', 					exact:true, name: 'Ingresar', 		component: DefaultLayout },         // Login
	{ path: '/app/dashboard',       				name: 'Inicio',			component: Dashboard },             // Ventana principal
	{ path: '/app/traspasos',       				name: 'Traspasos', 		component: Movimientos },           // Traspazos entre almacenes
	{ path: '/app/logout',          				name: 'Logout',    		component: Logout },                // Logout
];

export const routes_almacenes_licor = [
	{ path: '/app/', 					exact:true, name: 'Ingresar', 		component: DefaultLayout },         // Login
	{ path: '/app/dashboard',       				name: 'Inicio',			component: Dashboard },             // Ventana principal
	{ path: '/app/inventarioBotellas', 				name: 'Inventario', 	component: InventarioDeBotellas },  // Inventario de botellas por areas
	{ path: '/app/traspasos',       				name: 'Traspasos', 		component: Movimientos },           // Traspazos entre almacenes
	{ path: '/app/reportes',        				name: 'Reportes', 		component: ReporteDeMovimientos },  // Reporte de movimiento de productos
	{ path: '/app/logout',          				name: 'Logout',    		component: Logout },                // Logout
];

export const routes_almacenes_general = [
	{ path: '/app/', 					exact:true, name: 'Ingresar', 		component: DefaultLayout },         // Login
	{ path: '/app/dashboard',       				name: 'Inicio',			component: Dashboard },             // Ventana principal
	{ path: '/app/inventarioBotellas', 				name: 'Inventario', 	component: InventarioDeBotellas },  // Inventario de botellas por areas
	{ path: '/app/traspasos',       				name: 'Traspasos', 		component: Movimientos },           // Traspazos entre almacenes
	{ path: '/app/reportes',        				name: 'Reportes', 		component: ReporteDeMovimientos },  // Reporte de movimiento de productos
	{ path: '/app/logout',          				name: 'Logout',    		component: Logout },                // Logout
];