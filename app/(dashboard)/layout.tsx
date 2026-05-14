import DashboardChrome from "@/components/layout/DashboardChrome";

export default function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardChrome>{children}</DashboardChrome>;
}
