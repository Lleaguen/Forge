export function useToast() {
  return {
    success: (msg: string) => alert(msg),
    error: (msg: string) => alert(msg)
  }
}
