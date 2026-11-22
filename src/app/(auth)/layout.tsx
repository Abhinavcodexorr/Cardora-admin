export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <main className="flex min-h-screen flex-1">{children}</main>;
}
