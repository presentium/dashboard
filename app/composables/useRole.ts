export function useRole() {
  const { user } = useOidcAuth()
  return {
    admin: computed(() => user.value.providerInfo?.roles?.includes('admin') ?? false),
    teacher: computed(() => user.value.providerInfo?.roles?.some((r: string) => ['admin', 'teacher'].includes(r)) ?? false),
    student: computed(() => user.value.providerInfo?.roles?.some((r: string) => ['admin', 'teacher', 'student'].includes(r)) ?? false),
  }
}
