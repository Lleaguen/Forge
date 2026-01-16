export function ErrorState({ message = 'Something went wrong' }: { message?: string }) {
  return <div>{message}</div>
}
