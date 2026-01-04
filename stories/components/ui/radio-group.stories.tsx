import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentProps } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const meta = {
  title: "Components/ui/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledRadioGroup = (args: ComponentProps<typeof RadioGroup>) => {
  const [value, setValue] = useState(args.defaultValue || "option-one");

  return (
    <RadioGroup {...args} value={value} onValueChange={setValue}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Option Three</Label>
      </div>
    </RadioGroup>
  );
};

export const Default: Story = {
  args: {
    defaultValue: "option-one",
  },
  render: args => <ControlledRadioGroup {...args} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: "option-one",
    disabled: true,
  },
  render: args => <ControlledRadioGroup {...args} />,
};

export const DisabledItems: Story = {
  render: () => (
    <RadioGroup defaultValue="option-two">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one-disabled" disabled />
        <Label htmlFor="option-one-disabled" className="text-muted-foreground">
          Option One (Disabled)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two-enabled" />
        <Label htmlFor="option-two-enabled">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three-enabled" />
        <Label htmlFor="option-three-enabled">Option Three</Label>
      </div>
    </RadioGroup>
  ),
};
