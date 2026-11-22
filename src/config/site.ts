import type { Route } from "next";
import {
  Bell,
  BarChart3,
  Car,
  FileText,
  Handshake,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldCheck,
  Tag,
  Users,
  Wallet,
  Wrench,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "Cardora Admin",
  description: "Administration console for Cardora.",
} as const;

export type NavItem = { title: string; slug: string; href: Route; icon: LucideIcon };
export type NavGroup = { label: string; items: NavItem[] };

const item = (title: string, slug: string, icon: LucideIcon): NavItem => ({
  title,
  slug,
  icon,
  href: `/${slug}` as Route,
});

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      item("Dashboard", "dashboard", LayoutDashboard),
      item("Reports", "reports", BarChart3),
    ],
  },
  {
    label: "Customers",
    items: [
      item("Customers", "customers", Users),
      item("Vehicles", "vehicles", Car),
      item("Protection Packages", "protection-packages", ShieldCheck),
      item("Documents", "documents", FileText),
    ],
  },
  {
    label: "Engagement",
    items: [
      item("Rewards & Wallet", "rewards-wallet", Wallet),
      item("Referrals", "referrals", Handshake),
      item("Campaigns & Promotions", "campaigns", Megaphone),
      item("Notifications", "notifications", Bell),
    ],
  },
  {
    label: "Requests & Shop",
    items: [
      item("Service Requests", "service-requests", Wrench),
      item("Appraisal Requests", "appraisal-requests", Tag),
      item("Inventory (IMS Feed)", "inventory", Warehouse),
    ],
  },
  { label: "System", items: [item("Settings", "settings", Settings)] },
];

export const navItems: NavItem[] = navGroups.flatMap((g) => g.items);
