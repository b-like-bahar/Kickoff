import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

const meta = {
  title: "Components/ui/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClosedCollapsible: Story = {
  args: {
    defaultOpen: false,
  },
  render: args => (
    <Collapsible className="w-[350px] space-y-2" {...args}>
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Collapsible Demo</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        This content is always visible
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          This content is hidden by default
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          Click the toggle button above to show/hide this content
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const OpenedCollapsible: Story = {
  args: {
    defaultOpen: true,
  },
  render: args => (
    <Collapsible className="w-[350px] space-y-2" {...args}>
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Collapsible Demo</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        This content is always visible
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          This content is hidden by default
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          Click the toggle button above to show/hide this content
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
