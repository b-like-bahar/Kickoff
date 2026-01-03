import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Plus } from "lucide-react";

import React from "react";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/ui/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select" },
    size: { control: "select" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "default",
    disabled: false,
    children: "Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "default",
    disabled: false,
    children: "Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "default",
    disabled: false,
    children: "Button",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    size: "default",
    disabled: false,
    children: "Button",
  },
};

export const Large: Story = {
  args: {
    variant: "default",
    size: "lg",
    disabled: false,
    children: "Button",
  },
};

export const Small: Story = {
  args: {
    variant: "default",
    size: "sm",
    disabled: false,
    children: "Button",
  },
};

export const Icon: Story = {
  render: () => (
    <Button variant="default" size="icon">
      <Plus className="h-4 w-4" />
    </Button>
  ),
};

export const Disabled: Story = {
  args: {
    variant: "default",
    size: "default",
    disabled: true,
    children: "Button",
  },
};
