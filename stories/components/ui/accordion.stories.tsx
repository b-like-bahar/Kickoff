import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const meta = {
  title: "Components/ui/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
    collapsible: { control: "boolean" },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample accordion items for demonstration
const accordionItems = [
  {
    value: "item-1",
    trigger: "Is this accessible?",
    content: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    value: "item-2",
    trigger: "Is this styled?",
    content: "Yes. It comes with default styles that match the other components' aesthetic.",
  },
  {
    value: "item-3",
    trigger: "Is it animated?",
    content: "Yes. It's animated by default, but you can disable it if you prefer.",
  },
];

export const Default: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: args => (
    <Accordion className="w-[400px]" {...args}>
      {accordionItems.map(item => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const SingleItemOpen: Story = {
  args: {
    type: "single",
    collapsible: false,
    defaultValue: "item-1",
  },
  render: args => (
    <Accordion className="w-[400px]" {...args}>
      {accordionItems.map(item => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const MultipleItemsOpen: Story = {
  args: {
    type: "multiple",
    defaultValue: ["item-1", "item-2"],
  },
  render: args => (
    <Accordion className="w-[400px]" {...args}>
      {accordionItems.map(item => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
