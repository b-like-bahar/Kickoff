import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";

import { Progress } from "@/components/ui/progress";

const meta = {
  title: "Components/ui/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "number", min: 0, max: 100 } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 40,
  },
  render: args => (
    <div className="w-full space-y-2">
      <Progress {...args} className="bg-primary/20" />
      <p className="text-center text-sm text-muted-foreground">Static progress: {args.value}%</p>
    </div>
  ),
};

const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(prevProgress => {
        return prevProgress >= 100 ? 0 : prevProgress + 10;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="bg-primary/20" />
      <p className="text-center text-sm text-muted-foreground">Loading... {progress}%</p>
    </div>
  );
};

export const Loading: Story = {
  render: () => <LoadingProgress />,
};

export const CustomHeights: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <div className="space-y-1">
        <Progress value={33} className="h-1 bg-primary/20" />
        <p className="text-xs text-muted-foreground">Height: 1, Value: 33%</p>
      </div>
      <div className="space-y-1">
        <Progress value={66} className="h-3 bg-primary/20" />
        <p className="text-xs text-muted-foreground">Height: 3, Value: 66%</p>
      </div>
      <div className="space-y-1">
        <Progress value={100} className="h-5 bg-primary/20" />
        <p className="text-xs text-muted-foreground">Height: 5, Value: 100%</p>
      </div>
    </div>
  ),
};
