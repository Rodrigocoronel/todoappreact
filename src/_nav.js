export default
{
    items:
    [

        {
            title: true,
            name: 'Botellas',
            wrapper: {
                element: '',
                attributes: {}    
            },
            class: ''             
        },
        {
            name: 'Registro',
            url: '/app/agregarBotellas',
            icon: 'icon-pencil',
        },
        {
            name: 'Busquedas',
            url: '/app/buscarBotellas',
            icon: 'icon-magnifier',
        },
        {
            title: true,
            name: 'Almacenes',
            wrapper: {
                element: '',
                attributes: {},
            },
        },
        {
            name: 'Registro',
            url: '/app/almacenes',
            icon: 'icon-pencil',
        },
        {
            title: true,
            name: 'Movimientos',
            wrapper: {
                element: '',
                attributes: {},
            },
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
        {
            title: true,
            name: 'Usuarios',
            wrapper: {
                element: '',
                attributes: {},
            },
        },
        {
            name: 'Registro',
            url: '/app/usuarios/registro',
            icon: 'icon-pencil',
        },
        { divider: true, },
        {
            name: 'SALIR',
            url: '/app/usuarios/logout',
            icon: 'icon-logout',
        },
    ],
};
