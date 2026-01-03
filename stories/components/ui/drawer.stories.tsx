import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/ui/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bottom: Story = {
  args: {
    direction: "bottom",
  },
  render: args => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Bottom Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Make changes to your profile here.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <div className="grid gap-4">
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  defaultValue="John Doe"
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  defaultValue="@johndoe"
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          <DrawerFooter className="flex-col gap-2">
            <Button className="w-full">Save changes</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const Top: Story = {
  args: {
    direction: "top",
  },
  render: args => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Top Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>View your recent notifications.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0 space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="border rounded-lg p-3">
                <h4 className="font-medium text-sm">Notification {i}</h4>
                <p className="text-muted-foreground text-sm">
                  This is a notification message that appears in the top drawer.
                </p>
              </div>
            ))}
          </div>
          <DrawerFooter className="flex-col gap-2">
            <DrawerClose asChild>
              <Button className="w-full">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const Left: Story = {
  args: {
    direction: "left",
  },
  render: args => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Left Drawer</Button>
      </DrawerTrigger>
      <DrawerContent className="w-[300px] sm:w-[350px]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Navigation</DrawerTitle>
            <DrawerDescription>Main navigation menu.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <nav className="space-y-2">
              {["Home", "Products", "Features", "Pricing", "About", "Contact"].map(item => (
                <a
                  key={item}
                  href="#"
                  className="block py-2 px-4 rounded-md hover:bg-muted transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <DrawerFooter className="flex-col gap-2">
            <DrawerClose asChild>
              <Button className="w-full">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const Right: Story = {
  args: {
    direction: "right",
  },
  render: args => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Right Drawer</Button>
      </DrawerTrigger>
      <DrawerContent className="w-[300px] sm:w-[350px]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Side Panel</DrawerTitle>
            <DrawerDescription>
              This drawer slides in from the right side of the screen.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <p>Drawer content goes here.</p>
          </div>
          <DrawerFooter className="flex-col gap-2">
            <DrawerClose asChild>
              <Button className="w-full">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
