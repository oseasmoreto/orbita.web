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
