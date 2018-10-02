export default
{
    items:
    [
        {
            name: 'PAPAS & BEER',
            url: '/dashboard',
            icon: 'icon-basket-loaded',
            badge: {
                variant: 'info',
            },
        },
        
        
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
            name: 'Entradas',
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
            name: 'Traspasos',
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
            url: '/app/usuarios',
            icon: 'icon-pencil',
        },

        { divider: true, },
        {
            name: 'Salir',
            url: '/dashboard',
        },
    ],
};
