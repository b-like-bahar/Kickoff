import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define size mapping for examples
const sizeMap = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
};

// Define color options for examples
const colorOptions = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-gray-500",
];

// Generate alphabet for examples
const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

const meta = {
  title: "Components/ui/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story using a wrapper component
const InteractiveAvatar = (props: {
  size?: string;
  color?: string;
  initial?: string;
  showImage?: boolean;
}) => {
  const { size = "lg", color = "bg-gray-500", initial = "A", showImage = false } = props;
  const sizeClass = sizeMap[size as keyof typeof sizeMap] || sizeMap.md;

  return (
    <Avatar className={sizeClass}>
      {showImage && <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />}
      <AvatarFallback className={color}>{initial}</AvatarFallback>
    </Avatar>
  );
};

export const Default: StoryObj<typeof InteractiveAvatar> = {
  render: args => <InteractiveAvatar {...args} />,
  args: {
    size: "md",
    color: "bg-gray-500",
    initial: "A",
    showImage: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.keys(sizeMap),
    },
    color: {
      control: "select",
      options: colorOptions,
    },
    initial: {
      control: "select",
      options: alphabet,
    },
    showImage: {
      control: "boolean",
    },
  },
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const WithSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar className={sizeMap.xs}>
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar className={sizeMap.sm}>
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar className={sizeMap.md}>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className={sizeMap.lg}>
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className={sizeMap.xl}>
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {colorOptions.map(color => (
        <Avatar key={color}>
          <AvatarFallback className={color}>
            {color.split("-")[1].charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const Alphabets: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {alphabet.slice(0, 10).map(letter => (
        <Avatar key={letter}>
          <AvatarFallback>{letter}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
