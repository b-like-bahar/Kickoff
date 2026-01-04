import type { Meta, StoryObj } from "@storybook/react";
import Link from "next/link";
import * as React from "react";
import { type ComponentRef } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/utils/client-utils";
import { BarChart3, Layout, Settings } from "lucide-react";

const meta = {
  title: "Components/ui/NavigationMenu",
  component: NavigationMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Component definitions for the Default variant
const productFeatures = [
  {
    title: "Features",
    href: "/features",
    description: "Explore the powerful capabilities of our platform.",
  },
  {
    title: "Solutions",
    href: "/solutions",
    description: "Industry-specific implementations and use cases.",
  },
  {
    title: "Integrations",
    href: "/integrations",
    description: "Connect with your favorite tools and services.",
  },
];

// Resource items for the Default variant
const resourceItems = [
  {
    title: "Documentation",
    href: "/resources/documentation",
    description: "Comprehensive guides to help you get started.",
  },
  {
    title: "API Reference",
    href: "/resources/api",
    description: "Detailed documentation for developers and integrators.",
  },
  {
    title: "Tutorials",
    href: "/resources/tutorials",
    description: "Step-by-step guides for common use cases.",
  },
  {
    title: "Example Projects",
    href: "/resources/examples",
    description: "Ready-to-use examples for faster development.",
  },
  {
    title: "Community",
    href: "/resources/community",
    description: "Connect with other developers and share knowledge.",
  },
  {
    title: "Blog",
    href: "/resources/blog",
    description: "Latest news, tips, and insights from our team.",
  },
];

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-600 to-indigo-800 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium text-white">
                      SuperApp Platform
                    </div>
                    <p className="text-sm leading-tight text-white/80">
                      Build powerful applications with our integrated tools and services.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {productFeatures.map(item => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {resourceItems.map(item => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link href="/pricing">Pricing</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// Dashboard items for the WithIcons variant
const dashboardItems = [
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    description: "View metrics and reports for your application.",
    icon: BarChart3,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    description: "Organize and track your development projects.",
    icon: Layout,
  },
];

export const WithIcons: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center">
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Layout className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              {dashboardItems.map(item => (
                <IconListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>
                  {item.description}
                </IconListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[220px] p-4">
              <div className="font-medium mb-2 text-sm">User Settings</div>
              <div className="space-y-1">
                <a
                  href="/settings/profile"
                  className="block text-sm py-1.5 px-2 rounded-md hover:bg-accent"
                >
                  Profile
                </a>
                <a
                  href="/settings/account"
                  className="block text-sm py-1.5 px-2 rounded-md hover:bg-accent"
                >
                  Account
                </a>
                <a
                  href="/settings/security"
                  className="block text-sm py-1.5 px-2 rounded-md hover:bg-accent"
                >
                  Security
                </a>
                <a
                  href="/settings/notifications"
                  className="block text-sm py-1.5 px-2 rounded-md hover:bg-accent"
                >
                  Notifications
                </a>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

const ListItem = React.forwardRef<
  ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const IconListItem = React.forwardRef<
  ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
IconListItem.displayName = "IconListItem";
