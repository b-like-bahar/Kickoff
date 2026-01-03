import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import { Slider } from "@/components/ui/slider";

const meta = {
  title: "Components/ui/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultSlider = () => {
  const [value, setValue] = useState<number[]>([50]);
  return (
    <div className="w-50">
      <Slider defaultValue={[50]} max={100} step={1} className="w-full" onValueChange={setValue} />
      <div className="mt-2 text-center">Value: {value[0]}</div>
    </div>
  );
};

const RangeSlider = () => {
  const [value, setValue] = useState<number[]>([25, 75]);
  return (
    <div className="w-50">
      <Slider
        defaultValue={[25, 75]}
        max={100}
        step={1}
        className="w-full"
        onValueChange={setValue}
      />
      <div className="mt-2 text-center">
        Range: {value[0]} - {value[1]}
      </div>
    </div>
  );
};

const StepSlider = () => {
  const [value, setValue] = useState<number[]>([20]);
  return (
    <div className="w-50">
      <Slider defaultValue={[20]} max={100} step={20} className="w-full" onValueChange={setValue} />
      <div className="mt-2 text-center">Value: {value[0]} (step: 20)</div>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultSlider />,
};

export const Range: Story = {
  render: () => <RangeSlider />,
};

export const Steps: Story = {
  render: () => <StepSlider />,
};

export const Disabled: Story = {
  render: () => (
    <div className="w-50">
      <Slider defaultValue={[40]} max={100} step={1} disabled className="w-full" />
      <div className="mt-2 text-center">Disabled slider</div>
    </div>
  ),
};
