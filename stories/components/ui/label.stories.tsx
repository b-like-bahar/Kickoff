import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const meta = {
  title: "Components/ui/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Accept terms and conditions",
  },
};

export const WithInput: Story = {
  render: args => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email" {...args}>
        Email
      </Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: args => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" {...args}>
        Accept terms and conditions
      </Label>
    </div>
  ),
};

export const WithSwitch: Story = {
  render: args => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" {...args}>
        Airplane Mode
      </Label>
    </div>
  ),
};

export const WithRadioGroup: Story = {
  render: args => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one" {...args}>
          Option One
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two" {...args}>
          Option Two
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDisabledControl: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled-input" className="text-muted-foreground">
        Disabled Field
      </Label>
      <Input type="text" id="disabled-input" disabled />
    </div>
  ),
};
