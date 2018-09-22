export default {
  items: [
    {
      name: 'Dashboard',
      url: '/app/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      title: true,
      name: 'Theme',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Colors',
      url: '/app/theme/colors',
      icon: 'icon-drop',
    },
    {
      name: 'Typography',
      url: '/app/theme/typography',
      icon: 'icon-pencil',
    },
    {
      title: true,
      name: 'Components',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Base',
      url: '/app/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Breadcrumbs',
          url: '/app/base/breadcrumbs',
          icon: 'icon-puzzle',
        },
        {
          name: 'Cards',
          url: '/app/base/cards',
          icon: 'icon-puzzle',
        },
        {
          name: 'Carousels',
          url: '/app/base/carousels',
          icon: 'icon-puzzle',
        },
        {
          name: 'Collapses',
          url: '/app/base/collapses',
          icon: 'icon-puzzle',
        },
        {
          name: 'Dropdowns',
          url: '/app/base/dropdowns',
          icon: 'icon-puzzle',
        },
        {
          name: 'Forms',
          url: '/app/base/forms',
          icon: 'icon-puzzle',
        },
        {
          name: 'Jumbotrons',
          url: '/app/base/jumbotrons',
          icon: 'icon-puzzle',
        },
        {
          name: 'List groups',
          url: '/app/base/list-groups',
          icon: 'icon-puzzle',
        },
        {
          name: 'Navs',
          url: '/app/base/navs',
          icon: 'icon-puzzle',
        },
        {
          name: 'Paginations',
          url: '/app/base/paginations',
          icon: 'icon-puzzle',
        },
        {
          name: 'Popovers',
          url: '/app/base/popovers',
          icon: 'icon-puzzle',
        },
        {
          name: 'Progress Bar',
          url: '/app/base/progress-bar',
          icon: 'icon-puzzle',
        },
        {
          name: 'Switches',
          url: '/app/base/switches',
          icon: 'icon-puzzle',
        },
        {
          name: 'Tables',
          url: '/app/base/tables',
          icon: 'icon-puzzle',
        },
        {
          name: 'Tabs',
          url: '/app/base/tabs',
          icon: 'icon-puzzle',
        },
        {
          name: 'Tooltips',
          url: '/app/base/tooltips',
          icon: 'icon-puzzle',
        },
      ],
    },
    {
      name: 'Buttons',
      url: '/app/buttons',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Buttons',
          url: '/app/buttons/buttons',
          icon: 'icon-cursor',
        },
        {
          name: 'Button dropdowns',
          url: '/app/buttons/button-dropdowns',
          icon: 'icon-cursor',
        },
        {
          name: 'Button groups',
          url: '/app/buttons/button-groups',
          icon: 'icon-cursor',
        },
        {
          name: 'Brand Buttons',
          url: '/app/buttons/brand-buttons',
          icon: 'icon-cursor',
        },
      ],
    },
    {
      name: 'Charts',
      url: '/app/charts',
      icon: 'icon-pie-chart',
    },
    {
      name: 'Icons',
      url: '/app/icons',
      icon: 'icon-star',
      children: [
        {
          name: 'CoreUI Icons',
          url: '/app/icons/coreui-icons',
          icon: 'icon-star',
          badge: {
            variant: 'info',
            text: 'NEW',
          },
        },
        {
          name: 'Flags',
          url: '/app/icons/flags',
          icon: 'icon-star',
        },
        {
          name: 'Font Awesome',
          url: '/app/icons/font-awesome',
          icon: 'icon-star',
          badge: {
            variant: 'secondary',
            text: '4.7',
          },
        },
        {
          name: 'Simple Line Icons',
          url: '/app/icons/simple-line-icons',
          icon: 'icon-star',
        },
      ],
    },
    {
      name: 'Notifications',
      url: '/app/notifications',
      icon: 'icon-bell',
      children: [
        {
          name: 'Alerts',
          url: '/app/notifications/alerts',
          icon: 'icon-bell',
        },
        {
          name: 'Badges',
          url: '/app/notifications/badges',
          icon: 'icon-bell',
        },
        {
          name: 'Modals',
          url: '/app/notifications/modals',
          icon: 'icon-bell',
        },
      ],
    },
    {
      name: 'Widgets',
      url: '/app/widgets',
      icon: 'icon-calculator',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      divider: true,
    },
    {
      title: true,
      name: 'Extras',
    },
    {
      name: 'Pages',
      url: '/app/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'Login',
          url: '/app/login',
          icon: 'icon-star',
        },
        {
          name: 'Register',
          url: '/app/register',
          icon: 'icon-star',
        },
        {
          name: 'Error 404',
          url: '/app/404',
          icon: 'icon-star',
        },
        {
          name: 'Error 500',
          url: '/app/500',
          icon: 'icon-star',
        },
      ],
    },
    {
      name: 'Download CoreUI',
      url: 'http://coreui.io/react/',
      icon: 'icon-cloud-download',
      class: 'mt-auto',
      variant: 'success',
    },
    {
      name: 'Try CoreUI PRO',
      url: 'http://coreui.io/pro/react/',
      icon: 'icon-layers',
      variant: 'danger',
    },
  ],
};
