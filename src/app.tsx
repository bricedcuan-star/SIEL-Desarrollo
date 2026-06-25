import { createRootRoute, Outlet, createRootRouteWithContext } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => <Outlet />,
})
