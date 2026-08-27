import type { Component } from 'vue'

export interface DropdownMenuOption {
  icon?: Component
  key: string
  label: string
  separatorBefore?: boolean
}
