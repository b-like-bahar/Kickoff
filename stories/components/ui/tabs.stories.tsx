import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const meta = {
  title: "Components/ui/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Tabs defaultValue="account" className="w-[400px]" {...args}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="mt-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-2">Settings</h3>
        <p className="text-sm text-gray-500">Manage your account settings and preferences.</p>
      </TabsContent>
      <TabsContent value="password" className="mt-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-2">Password Settings</h3>
        <p className="text-sm text-gray-500">Change your password and security settings.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const ThreeTabs: Story = {
  render: args => (
    <Tabs defaultValue="profile" className="w-[400px]" {...args}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-2">Profile</h3>
        <p className="text-sm text-gray-500">Manage your profile information.</p>
      </TabsContent>
      <TabsContent value="notifications" className="mt-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-2">Notifications</h3>
        <p className="text-sm text-gray-500">Configure your notification preferences.</p>
      </TabsContent>
      <TabsContent value="settings" className="mt-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-2">Settings</h3>
        <p className="text-sm text-gray-500">Manage your application settings.</p>
      </TabsContent>
    </Tabs>
  ),
};
