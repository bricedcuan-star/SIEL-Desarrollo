import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <div>¡Hola, el archivo Index funciona!</div>,
})
