import ConfirmationModal from '~/components/ConfirmationModal.vue'

export function useConfirm(
  opts: {
    title: string
    description: string
    onConfirm?: () => Promise<void> | void
    onCancel?: () => Promise<void> | void
  },
) {
  const modal = useModal()
  modal.open(ConfirmationModal, {
    ...opts,
    onConfirm: () => {
      modal.close()
      opts.onConfirm?.()
    },
    onCancel: () => {
      modal.close()
      opts.onCancel?.()
    },
  })
}
