import { useRegisterSW } from 'virtual:pwa-register/vue'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

export function useAppUpdatePrompt(): void {
  const { needRefresh, updateServiceWorker } = useRegisterSW()

  watch(needRefresh, (isAvailable) => {
    if (!isAvailable) {
      return
    }

    toast('Nova versão disponível', {
      action: {
        label: 'Atualizar',
        onClick: () => {
          void updateServiceWorker(true)
        },
      },
      description: 'Atualize para ver as últimas mudanças.',
      duration: Number.POSITIVE_INFINITY,
    })
  })
}
