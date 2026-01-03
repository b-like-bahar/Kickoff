import type { Meta, StoryObj } from "@storybook/react";

import { Separator } from "@/components/ui/separator";

const meta = {
  title: "Components/ui/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    decorative: { control: "boolean" },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  render: args => (
    <div className="w-80">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" {...args} />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" className="h-full" />
        <div>Docs</div>
        <Separator orientation="vertical" className="h-full" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: args => (
    <div className="flex h-10 items-center space-x-4">
      <div>Blog</div>
      <Separator {...args} className="h-full" />
      <div>Docs</div>
      <Separator {...args} className="h-full" />
      <div>Source</div>
    </div>
  ),
};
