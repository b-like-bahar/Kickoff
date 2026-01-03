import type { Meta, StoryObj } from "@storybook/react";
import {
  Home as HomeIcon,
  FileText as FileTextIcon,
  Users as UsersIcon,
  Plus as PlusIcon,
  LogOut as LogOutIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  CircleUser as CircleUserIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useState } from "react";

const meta = {
  title: "Components/ui/Sidebar",
  component: SidebarProvider,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SidebarProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// CSS to hide header text when sidebar is collapsed
const headerTextCss = `
  .fixed-sidebar [data-state="collapsed"] .header-text-container {
    display: none !important;
  }
`;

function DefaultSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isDocumentSubMenuOpen, setIsDocumentSubMenuOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const toggleDocumentSubMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDocumentSubMenuOpen(!isDocumentSubMenuOpen);
  };

  return (
    <>
      <style>{headerTextCss}</style>
      <div className="fixed-sidebar">
        <SidebarProvider open={isOpen} onOpenChange={handleOpenChange}>
          <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
              <div className="flex items-center pt-2 gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
                  <AvatarFallback>DC</AvatarFallback>
                </Avatar>
                {/* Wrap the text in a separate container that can be hidden */}
                <div className="header-text-container">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">Dashboard</span>
                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                  </div>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                <SidebarGroupAction>
                  <PlusIcon />
                </SidebarGroupAction>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive tooltip="Dashboard">
                        <HomeIcon />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Users">
                        <UsersIcon />
                        <span>Users</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>12</SidebarMenuBadge>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Documents">
                        <FileTextIcon />
                        <span>Documents</span>
                      </SidebarMenuButton>
                      <SidebarMenuAction onClick={toggleDocumentSubMenu}>
                        {isDocumentSubMenuOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                      </SidebarMenuAction>
                      {isDocumentSubMenuOpen && (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>All Documents</SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton isActive>Recent</SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>Shared</SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Profile">
                    <CircleUserIcon />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Logout">
                    <LogOutIcon />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="p-3 ml-5">
            <h1 className="text-2xl font-bold mb-4">Main Content</h1>
            <p className="mb-4">This is the main content area of the application.</p>
            <div className="flex gap-2">
              <SidebarTrigger onClick={() => {}} />
            </div>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}

export const Default: Story = {
  render: () => <DefaultSidebar />,
};
