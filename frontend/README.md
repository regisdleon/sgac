# Nuxt Auth Utils Email/Password Login Example

This is a simple example of how to use the Nuxt Auth Utils to create a login system with email/password authentication.

Read the companion article on the Vue School Blog.

## Setup

```bash
npm install
```

```bash
npm run dev
```

Then you can register on the `register` page and login on the `login` page.
Users are stored in KV storage using Nuxt's built in useStorage function but you can easily adapt the code to any other storage solution (like a database).

app/
├── components/
│   ├── layout/
│   │   ├── DashboardSidebar.vue
│   │   ├── DashboardNavbar.vue
│   │   └── DashboardFooter.vue
│   └── common/
│       └── UserCard.vue
├── layouts/
│   ├── default.vue        ← para páginas públicas como login
│   └── dashboard.vue      ← para vistas del dashboard
├── pages/
│   ├── login.vue          ← /login
│   ├── index.vue          ← redirige a login o dashboard
│   ├── dashboard/
│   │   ├── index.vue      ← /dashboard
│   │   └── usuarios.vue   ← /dashboard/usuarios
│   └── [..].vue           ← 404 page (NotFound)
├── middleware/
│   └── auth.ts     ← middleware global de protección
└── utils/
└── auth.ts            ← lógica auxiliar si la necesitas
