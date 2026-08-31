import { resolveBreadcrumbItems } from '@/core/layouts/composables/useBreadcrumb'
import type { NavGroup } from '@/core/layouts/types/navigation.type'

const groups: NavGroup[] = [
  {
    items: [
      { id: 'dashboard-default', label: 'Default', to: { name: 'home' } },
      { id: 'dashboard-ecommerce', label: 'eCommerce' },
    ],
    title: 'Dashboards',
  },
  {
    items: [
      {
        children: [
          { id: 'pages-user-profile-overview', label: 'Overview' },
          {
            id: 'pages-user-profile-projects',
            label: 'Projects',
            to: { name: 'user-profile-projects' },
          },
        ],
        id: 'pages-user-profile',
        label: 'User Profile',
      },
    ],
    title: 'Pages',
  },
]

describe('resolveBreadcrumbItems', () => {
  it('resolves [group, item] for a top-level item matching the current route', () => {
    const items = resolveBreadcrumbItems(groups, 'home', 'Orbita')

    expect(items).toEqual([{ label: 'Dashboards', to: { name: 'home' } }, { label: 'Default' }])
  })

  it('resolves [group, child] for a nested child matching the current route', () => {
    const items = resolveBreadcrumbItems(groups, 'user-profile-projects', 'Orbita')

    expect(items).toEqual([
      { label: 'Pages', to: { name: 'user-profile-projects' } },
      { label: 'Projects' },
    ])
  })

  it('falls back to a single item with the fallback title when no route matches', () => {
    const items = resolveBreadcrumbItems(groups, 'unknown-route', 'Configurações')

    expect(items).toEqual([{ label: 'Configurações' }])
  })

  it('falls back when routeName is null (no active route yet)', () => {
    const items = resolveBreadcrumbItems(groups, null, 'Orbita')

    expect(items).toEqual([{ label: 'Orbita' }])
  })
})

describe('resolveBreadcrumbItems — related routes (deep link variants of the same page)', () => {
  // Achado real, reportado pelo usuário em 2026-08-31: `/products/new`/
  // `/products/:id/edit` (deep link pro Drawer, `route.name` diferente de
  // `'products'`) perdiam o "Catálogo /" inteiro — `findActiveTrail` só
  // casava por igualdade exata de `to.name`, então a rota nunca era
  // encontrada na árvore e caía direto pro fallback sozinho ("Produtos",
  // sem trilha). `relatedRouteNames` resolve isso: a rota related ainda
  // acha o mesmo grupo/item, e ganha um 3º nível (o título da própria
  // rota) — era pra ficar "Catálogo / Produtos / Novo produto", não só
  // "Produtos".
  const groupsWithRelated: NavGroup[] = [
    {
      items: [
        {
          id: 'catalog-products',
          label: 'Produtos',
          relatedRouteNames: ['products-new', 'products-edit'],
          to: { name: 'products' },
        },
      ],
      title: 'Catálogo',
    },
  ]

  it('resolves [group, item, current title] for a related route, item gains a `to` (it is now an ancestor, not the final page)', () => {
    const items = resolveBreadcrumbItems(groupsWithRelated, 'products-new', 'Novo produto')

    expect(items).toEqual([
      { label: 'Catálogo', to: { name: 'products' } },
      { label: 'Produtos', to: { name: 'products' } },
      { label: 'Novo produto' },
    ])
  })

  it('resolves the same 3-level trail for the other related route (edit)', () => {
    const items = resolveBreadcrumbItems(groupsWithRelated, 'products-edit', 'Editar produto')

    expect(items).toEqual([
      { label: 'Catálogo', to: { name: 'products' } },
      { label: 'Produtos', to: { name: 'products' } },
      { label: 'Editar produto' },
    ])
  })

  it('still resolves the plain 2-level trail (no 3rd level, item has no `to`) for the exact route itself', () => {
    const items = resolveBreadcrumbItems(groupsWithRelated, 'products', 'Produtos')

    expect(items).toEqual([{ label: 'Catálogo', to: { name: 'products' } }, { label: 'Produtos' }])
  })
})
