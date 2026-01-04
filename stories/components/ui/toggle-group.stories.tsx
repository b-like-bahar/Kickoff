import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState, type ComponentProps } from "react";

const meta = {
  title: "Components/ui/ToggleGroup",
  component: ToggleGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

type ToggleGroupDemoArgs = Pick<
  ComponentProps<typeof ToggleGroup>,
  "variant" | "size" | "disabled" | "className"
>;

const SingleToggleGroupDemo = (args: ToggleGroupDemoArgs) => {
  const [value, setValue] = useState("italic");

  return (
    <ToggleGroup
      className={args.className}
      variant={args.variant}
      size={args.size}
      disabled={args.disabled}
      type="single"
      value={value}
      onValueChange={setValue}
    >
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

const MultipleToggleGroupDemo = (args: ToggleGroupDemoArgs) => {
  const [value, setValue] = useState(["bold"]);

  return (
    <ToggleGroup
      className={args.className}
      variant={args.variant}
      size={args.size}
      disabled={args.disabled}
      type="multiple"
      value={value}
      onValueChange={setValue}
    >
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

const TextAndIconToggleGroupDemo = (args: ToggleGroupDemoArgs) => {
  const [value, setValue] = useState("left");

  return (
    <ToggleGroup
      className={args.className}
      variant={args.variant}
      size={args.size}
      disabled={args.disabled}
      type="single"
      value={value}
      onValueChange={setValue}
    >
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="size-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Left</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="size-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Center</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="size-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Right</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export const SingleTypeSelection: Story = {
  args: {
    type: "single",
  },
  render: args => <SingleToggleGroupDemo {...args} />,
};

export const MultipleTypeSelection: Story = {
  args: {
    type: "multiple",
  },
  render: args => <MultipleToggleGroupDemo {...args} />,
};

export const WithOutline: Story = {
  args: {
    type: "single",
    variant: "outline",
  },
  render: args => <SingleToggleGroupDemo {...args} />,
};

export const WithSizeSm: Story = {
  args: {
    type: "single",
    size: "sm",
  },
  render: args => <SingleToggleGroupDemo {...args} />,
};

export const WithSizeLg: Story = {
  args: {
    type: "single",
    size: "lg",
  },
  render: args => <SingleToggleGroupDemo {...args} />,
};

export const WithTextAndIcon: Story = {
  args: {
    type: "single",
  },
  render: args => <TextAndIconToggleGroupDemo {...args} />,
};

export const Disabled: Story = {
  args: {
    type: "single",
    disabled: true,
  },
  render: args => <SingleToggleGroupDemo {...args} />,
};
