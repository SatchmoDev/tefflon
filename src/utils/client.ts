export const shape = (fd: FormData) => {
  return Object.fromEntries(fd) as { [k: string]: string }
}
