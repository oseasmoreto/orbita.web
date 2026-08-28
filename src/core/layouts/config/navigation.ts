import {
  Article,
  Books,
  ChartPieSlice,
  ChatCircle,
  FolderSimple,
  IdentificationCard,
  ShoppingCart,
  UsersThree,
  Wallet,
} from '@/shared/components/icons/regular.generated'
import type { NavGroup, NavItem } from '../types/navigation.type'

/**
 * Grounded na captura real do usuário (2026-08-28, sidebar com grupos e
 * dropdown do Figma) — pedida explicitamente como EXEMPLO da estrutura
 * (grupos "Dashboards"/"Pages", item expansível "User Profile" com
 * filhos), não como navegação real do Orbita ainda. Só "Default" (era
 * "Dashboard") mantém `to` de verdade (`home`, a única rota que existe
 * hoje) — o resto fica sem `to` de propósito: um botão sem `to` e sem
 * `children` não navega a lugar nenhum quando clicado (mesma regra de
 * "nunca link morto pra rota que ainda não existe" do CLAUDE.md raiz),
 * diferente de um link quebrado apontando pra uma rota inexistente.
 * Substituir por rotas reais conforme cada fase de
 * docs/planejamento/plano-implementacao.md for entregando as telas.
 */
export const favoriteItems: NavItem[] = [
  { id: 'favorite-overview', label: 'Overview', to: { name: 'home' } },
  { id: 'favorite-projects', label: 'Projects' },
]

export const navGroups: NavGroup[] = [
  {
    items: [
      { icon: ChartPieSlice, id: 'dashboard-default', label: 'Default', to: { name: 'home' } },
      { icon: ShoppingCart, id: 'dashboard-ecommerce', label: 'eCommerce' },
      { icon: FolderSimple, id: 'dashboard-projects', label: 'Projects' },
      { icon: Books, id: 'dashboard-online-courses', label: 'Online Courses' },
    ],
    title: 'Dashboards',
  },
  {
    items: [
      {
        children: [
          { id: 'pages-user-profile-overview', label: 'Overview' },
          { id: 'pages-user-profile-projects', label: 'Projects' },
          { id: 'pages-user-profile-campaigns', label: 'Campaigns' },
          { id: 'pages-user-profile-documents', label: 'Documents' },
          { id: 'pages-user-profile-followers', label: 'Followers' },
        ],
        defaultExpanded: true,
        icon: IdentificationCard,
        id: 'pages-user-profile',
        label: 'User Profile',
      },
      { icon: Wallet, id: 'pages-account', label: 'Account' },
      { icon: UsersThree, id: 'pages-corporate', label: 'Corporate' },
      { icon: Article, id: 'pages-blog', label: 'Blog' },
      { icon: ChatCircle, id: 'pages-social', label: 'Social' },
    ],
    title: 'Pages',
  },
]
