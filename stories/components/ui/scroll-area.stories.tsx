import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const meta = {
  title: "Components/ui/ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = Array.from({ length: 50 }).map((_, i, a) => `This is item  ${a.length - i}`);

export const Default: Story = {
  render: args => (
    <ScrollArea className="h-72 w-48 rounded-md border" {...args}>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Items</h4>
        {items.map(item => (
          <React.Fragment key={item}>
            <div className="text-sm">{item}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScrolling: Story = {
  render: args => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border" {...args}>
      <div className="flex w-max space-x-4 p-4">
        {items.slice(0, 20).map(item => (
          <div key={item} className="text-sm border border-dashed border-slate-300 p-3">
            {item}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const WithContent: Story = {
  render: args => (
    <ScrollArea className="h-72 w-80 rounded-md border" {...args}>
      <div className="p-4">
        <h4 className="mb-4 text-xl font-bold">Lorem Ipsum</h4>
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor ligula at ipsum
          pulvinar, vel efficitur enim commodo. Duis auctor, diam sit amet scelerisque ultricies,
          nisi urna elementum augue, eget imperdiet felis magna vitae massa. Donec lacinia leo in
          metus molestie, at auctor metus commodo. Suspendisse potenti. Mauris at sem at metus
          luctus efficitur. Cras eget lorem ut dolor congue vehicula. In at urna non nulla
          sollicitudin interdum.
        </p>
        <p className="mt-4 text-sm">
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
          egestas. Integer dictum urna et augue vulputate, in semper eros tincidunt. Mauris
          imperdiet accumsan nisl, ac bibendum tortor rhoncus vitae. Integer finibus ante vel mi
          convallis, et tincidunt mi consequat. Nullam imperdiet ut nisl in fringilla. Sed quis
          tincidunt leo, eu gravida lectus. Suspendisse vitae aliquam magna.
        </p>
        <p className="mt-4 text-sm">
          Donec ullamcorper, dui nec dictum convallis, justo ipsum vehicula nibh, vel pulvinar odio
          lectus in metus. Etiam interdum, est at sagittis luctus, arcu sem pretium eros, at cursus
          lectus arcu vestibulum eros. Nullam malesuada, ipsum at suscipit vestibulum, nisl urna
          hendrerit nisi, et rutrum sem diam sit amet nisl.
        </p>
      </div>
    </ScrollArea>
  ),
};
