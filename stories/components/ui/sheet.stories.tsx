import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

const meta = {
  title: "Components/ui/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: args => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button className="w-[180px]" variant="outline">
          Open Right Sheet
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              className="col-span-3 h-9 rounded-md border border-input bg-transparent px-3 py-1"
              defaultValue="John Doe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              className="col-span-3 h-9 rounded-md border border-input bg-transparent px-3 py-1"
              defaultValue="@johndoe"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: args => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button className="w-[180px]" variant="outline">
          Open Left Sheet
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navigation options and settings.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 py-4">
          {["Home", "Dashboard", "Settings", "Profile", "Help"].map(item => (
            <Button key={item} variant="ghost" className="justify-start">
              {item}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: args => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button className="w-[180px]" variant="outline">
          Open Top Sheet
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Your recent notifications.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 py-4">
          <div className="rounded-md bg-muted p-3">
            <h4 className="font-medium">New Message</h4>
            <p className="text-sm text-muted-foreground">You have a new message from Jane.</p>
          </div>
          <div className="rounded-md bg-muted p-3">
            <h4 className="font-medium">Task Complete</h4>
            <p className="text-sm text-muted-foreground">
              Your task &quot;Update documentation&quot; is complete.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: args => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button className="w-[180px]" variant="outline">
          Open Bottom Sheet
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Music Player</SheetTitle>
          <SheetDescription>Now playing from your library.</SheetDescription>
        </SheetHeader>
        <div className="flex items-center justify-center gap-4 py-4">
          <Button size="icon" variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="19 20 9 12 19 4 19 20"></polygon>
              <line x1="5" y1="19" x2="5" y2="5"></line>
            </svg>
          </Button>
          <Button size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
          </Button>
          <Button size="icon" variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};
