export const administrador = 
{
	items:
	[
		{
	      name: 'Etiquetas',
	      url: '/facturas',
	      icon: 'icon-tag',
	      children: [
	        { 
	        	name: 'Imprimir', 
	        	url: '/app/cargarFacturas', 
	        	icon: 'icon-printer', 
	        },
			{ 
				name: 'Reimprimir', 
				url: '/app/destruirEtiqueta', 
				icon: 'icon-trash', 
			},
			{ 
	        	name: 'Facturas', 
	        	url: '/app/lista', 
	        	icon: 'icon-book-open', 
	        },
	        { 
	        	name: 'Etiquetas Reimpresas', 
	        	url: '/app/reimpresas', 
	        	icon: 'icon-book-open', 
	        }
	      ],
	    },
			
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

// export const supervisor = 
// {
// 	items:
// 	[
// 		{ title: true, name: 'Botellas', wrapper: { element: '', attributes: {} }, class: '' },
// 			{ name: 'Inventario', url: '/app/inventarioBotellas', icon: 'icon-note', },
// 		{ title: true, name: 'Movimientos', wrapper: { element: '', attributes: {}, }, },
// 			{ name: 'Entradas / Salidas', url: '/app/traspasos', icon: 'icon-pencil', },	
// 		{ divider: true, },		
// 		{ name: 'SALIR', url: '/app/logout', icon: 'icon-logout', },
// 	],
// };

export const gerente = 
{
	items:
	[
		{
	      name: 'Etiquetas',
	      url: '/facturas',
	      icon: 'icon-tag',
	      children: [
	        { 
	        	name: 'Imprimir', 
	        	url: '/app/cargarFacturas', 
	        	icon: 'icon-printer', 
	        },
			{ 
	        	name: 'Facturas', 
	        	url: '/app/lista', 
	        	icon: 'icon-book-open', 
	        },
	      ],
	    },
		{ 
			title: true, 
			name: 'Botellas', wrapper: { element: '', attributes: {} }, class: '' 
		},
		{ 
			name: 'Busquedas', 
			url: '/app/buscarBotellas', 
			icon: 'icon-magnifier', 
		},
		{ 
			name: 'Inventario', 
			url: '/app/inventarioBotellas', 
			icon: 'icon-note', 
		},
		{ 
			title: true, name: 'Movimientos', wrapper: { element: '', attributes: {}, }, 
		},
		{ 
			name: 'Entradas / Salidas', 
			url: '/app/traspasos', 
			icon: 'icon-pencil', 
		},
		{ 
			name: 'Reportes', 
			url: '/app/reportes', 
			icon: 'icon-magnifier', 
		},
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