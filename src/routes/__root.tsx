import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet /> {/* Aquí se renderizarán tus otras rutas */}
    </>
  ),
})
