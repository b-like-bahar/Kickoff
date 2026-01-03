import type { Meta, StoryObj } from "@storybook/react";
import { Loading } from "@/components/ui/loading";

const meta = {
  title: "Components/ui/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "fullscreen", "inline", "compact"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl"],
    },
    type: {
      control: { type: "select" },
      options: ["spinner", "dots", "skeleton", "text"],
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "spinner",
    variant: "default",
    size: "md",
  },
};

export const Spinner: Story = {
  args: {
    type: "spinner",
    variant: "default",
    size: "md",
  },
};

export const Dots: Story = {
  args: {
    type: "dots",
    variant: "default",
    size: "md",
  },
};

export const Skeleton: Story = {
  args: {
    type: "skeleton",
    variant: "default",
    skeletonRows: 3,
  },
};

export const Text: Story = {
  args: {
    type: "text",
    variant: "default",
    text: "Loading data...",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Small</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="spinner" size="sm" variant="inline" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Medium</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="spinner" size="md" variant="inline" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Large</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="spinner" size="lg" variant="inline" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Extra Large</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="spinner" size="xl" variant="inline" />
        </div>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Default</h3>
        <div className="h-32 border rounded-lg">
          <Loading type="spinner" variant="default" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Inline</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="dots" variant="inline" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Compact</h3>
        <div className="h-16 border rounded-lg">
          <Loading type="text" variant="compact" text="Loading..." />
        </div>
      </div>
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Spinner</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="spinner" variant="inline" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Dots</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="dots" variant="inline" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Skeleton</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="skeleton" variant="inline" skeletonRows={2} />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Text</h3>
        <div className="h-20 border rounded-lg">
          <Loading type="text" variant="inline" text="Processing..." />
        </div>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-2">User Profile</h3>
        <Loading type="skeleton" variant="inline" skeletonRows={4} />
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-2">Loading Comments</h3>
        <Loading type="dots" variant="inline" />
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-2">Saving Changes</h3>
        <Loading type="text" variant="inline" text="Saving..." />
      </div>
    </div>
  ),
};
