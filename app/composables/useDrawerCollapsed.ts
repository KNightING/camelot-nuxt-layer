// useState 讓狀態在 SSR 依請求隔離，client 端仍全域共用同一份
export const useDrawerCollapsed = () => useState('camelot-drawer-collapsed', () => true)
