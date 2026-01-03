import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const meta = {
  title: "Components/ui/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    delayDuration: { control: "number" },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover Me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip content</p>
      </TooltipContent>
    </Tooltip>
  ),
  args: {
    delayDuration: 300,
  },
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-center gap-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top</Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Shows above the element</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Shows to the left of the element</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Bottom</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Shows below the element</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Shows to the right of the element</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const Alignments: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-center gap-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top Start</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="start">
            <p>Aligned to the start</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top Center</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <p>Aligned to the center</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top End</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="end">
            <p>Aligned to the end</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

export const DelayDurations: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">No Delay</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Shows immediately</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="outline">500ms Delay</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Shows after 500ms</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button variant="outline">1s Delay</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Shows after 1 second</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Rich Content</Button>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-0">
          <div className="flex flex-col">
            <div className="px-4 py-2 font-semibold rounded-t-md">Tooltip Title</div>
            <div className="p-4">
              <p className="mb-2">This tooltip contains rich content with multiple elements.</p>
              <ul className="list-disc pl-4 mb-2">
                <li>List item one</li>
                <li>List item two</li>
                <li>List item three</li>
              </ul>
              <div className="text-xs text-muted-foreground">Additional information</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};
