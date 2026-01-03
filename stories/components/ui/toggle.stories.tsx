import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Italic, Underline } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

const meta = {
  title: "Components/ui/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    pressed: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Toggle bold",
    children: "Toggle",
  },
};

export const WithIcon: Story = {
  args: {
    "aria-label": "Toggle bold",
    children: <Bold />,
  },
};

export const WithText: Story = {
  args: {
    "aria-label": "Toggle bold",
    children: (
      <>
        <Bold /> Bold
      </>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    "aria-label": "Toggle italic",
    children: <Italic />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    "aria-label": "Toggle italic",
    children: "Disabled",
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    "aria-label": "Toggle underline",
    children: <Underline className="h-4 w-4" />,
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    "aria-label": "Toggle underline",
    children: <Underline className="h-4 w-4" />,
  },
};

export const Pressed: Story = {
  args: {
    pressed: true,
    "aria-label": "Toggle bold",
    children: "Pressed",
  },
};
