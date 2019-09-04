export const administrador = 
{
	items:
	[
		{ title: true, name: 'Etiquetas', wrapper: { element: '', attributes: {} }, class: '' },
			{ name: 'Imprimir', url: '/app/cargarFacturas', icon: 'icon-printer', },
			{ name: 'Eliminar', url: '/app/destruirEtiqueta', icon: 'icon-trash', },
		{ title: true, name: 'Botellas', wrapper: { element: '', attributes: {} }, class: '' },
			//{ name: 'Registro', url: '/app/agregarBotellas', icon: 'icon-pencil', },
			{ name: 'Busquedas', url: '/app/buscarBotellas', icon: 'icon-magnifier', },
			{ name: 'Inventario', url: '/app/inventarioBotellas', icon: 'icon-note', },
		{ title: true, name: 'Almacenes', wrapper: { element: '', attributes: {}, },},
			{ name: 'Registro', url: '/app/almacenes', icon: 'icon-pencil', },
		{ title: true, name: 'Movimientos', wrapper: { element: '', attributes: {}, }, },
			{ name: 'Entradas / Salidas', url: '/app/traspasos', icon: 'icon-pencil', },
			{ name: 'Reportes', url: '/app/reportes', icon: 'icon-magnifier', },
		{ title: true, name: 'Usuarios', wrapper: { element: '', attributes: {}, }, },
			{ name: 'Registro', url: '/app/registro', icon: 'icon-pencil', },
		{ divider: true, },
		{ name: 'SALIR', url: '/app/logout', icon: 'icon-logout', },
	],
};

export const supervisor = 
{
	items:
	[
		{ title: true, name: 'Botellas', wrapper: { element: '', attributes: {} }, class: '' },
			{ name: 'Inventario', url: '/app/inventarioBotellas', icon: 'icon-note', },
		{ title: true, name: 'Movimientos', wrapper: { element: '', attributes: {}, }, },
			{ name: 'Entradas / Salidas', url: '/app/traspasos', icon: 'icon-pencil', },	
		{ divider: true, },		
		{ name: 'SALIR', url: '/app/logout', icon: 'icon-logout', },
	],
};

export const gerente = 
{
	items:
	[
		{ title: true, name: 'Etiquetas', wrapper: { element: '', attributes: {} }, class: '' },
			{ name: 'Imprimir', url: '/app/cargarFacturas', icon: 'icon-printer', },
			{ name: 'Eliminar', url: '/app/destruirEtiqueta', icon: 'icon-trash', },
		{ title: true, name: 'Botellas', wrapper: { element: '', attributes: {} }, class: '' },
			//{ name: 'Registro', url: '/app/agregarBotellas', icon: 'icon-pencil', },
			{ name: 'Busquedas', url: '/app/buscarBotellas', icon: 'icon-magnifier', },
			{ name: 'Inventario', url: '/app/inventarioBotellas', icon: 'icon-note', },
		{ title: true, name: 'Almacenes', wrapper: { element: '', attributes: {}, },},
			{ name: 'Registro', url: '/app/almacenes', icon: 'icon-pencil', },
		{ title: true, name: 'Movimientos', wrapper: { element: '', attributes: {}, }, },
			{ name: 'Entradas / Salidas', url: '/app/traspasos', icon: 'icon-pencil', },
			{ name: 'Reportes', url: '/app/reportes', icon: 'icon-magnifier', },
		{ title: true, name: 'Usuarios', wrapper: { element: '', attributes: {}, }, },
			{ name: 'Registro', url: '/app/registro', icon: 'icon-pencil', },
		{ divider: true, },
		{ name: 'SALIR', url: '/app/logout', icon: 'icon-logout', },
	],
};

export const almacenGeneral = 
{
	items:
	[
		{ title: true, name: 'Botellas', wrapper: { element: '', attributes: {} }, class: '' },
			//{ name: 'Registro', url: '/app/agregarBotellas', icon: 'icon-pencil', },
			{ name: 'Inventario', url: '/app/inventarioBotellas', icon: 'icon-note', },
		{ title: true, name: 'Movimientos', wrapper: { element: '', attributes: {}, }, },
			{ name: 'Entradas / Salidas', url: '/app/traspasos', icon: 'icon-pencil', },
			{ name: 'Reportes', url: '/app/reportes', icon: 'icon-magnifier', },
		{ divider: true, },
		{ name: 'SALIR', url: '/app/logout', icon: 'icon-logout', },
	],
};

export const almacenLicor = 
{
	items:
	[
		{ title: true, name: 'Botellas', wrapper: { element: '', attributes: {} }, class: '' },
			{ name: 'Inventario', url: '/app/inventarioBotellas', icon: 'icon-note', },
		{ title: true, name: 'Movimientos', wrapper: { element: '', attributes: {}, }, },
			{ name: 'Entradas / Salidas', url: '/app/traspasos', icon: 'icon-pencil', },
			{ name: 'Reportes', url: '/app/reportes', icon: 'icon-magnifier', },
		{ divider: true, },
		{ name: 'SALIR', url: '/app/logout', icon: 'icon-logout', },
	],
};
export const barra = 
{
	items:
	[
		{ title: true, name: 'Movimientos', wrapper: { element: '', attributes: {}, }, },
			{ name: 'Entradas / Salidas', url: '/app/traspasos', icon: 'icon-pencil', },
		{ divider: true, },
		{ name: 'SALIR', url: '/app/logout', icon: 'icon-logout', },
	],
};