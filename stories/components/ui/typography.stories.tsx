import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Text,
  Blockquote,
  UnorderedList,
  OrderedList,
  CodeSnippet,
} from "@/components/ui/typography";

const meta = {
  title: "Components/ui/Typography",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1Typography: Story = {
  render: () => <Heading1>Heading 1</Heading1>,
};

export const Heading2Typography: Story = {
  render: () => <Heading2>Heading 2</Heading2>,
};

export const Heading3Typography: Story = {
  render: () => <Heading3>Heading 3</Heading3>,
};

export const Heading4Typography: Story = {
  render: () => <Heading4>Heading 4</Heading4>,
};

export const DefaultText: Story = {
  render: () => <Text>This is the default text component for general text.</Text>,
};

export const TextSizes: Story = {
  render: () => (
    <div className="space-y-2">
      <Text size="xs">Extra Small: This is xs size text.</Text>
      <Text size="sm">Small: This is sm size text.</Text>
      <Text size="md">Medium: This is md size text (default).</Text>
      <Text size="lg">Large: This is lg size text.</Text>
      <Text size="xl">Extra Large: This is xl size text.</Text>
    </div>
  ),
};

export const TextWeights: Story = {
  render: () => (
    <div className="space-y-2">
      <Text weight="normal">Normal weight text (default).</Text>
      <Text weight="medium">Medium weight text.</Text>
      <Text weight="semibold">Semibold weight text.</Text>
      <Text weight="bold">Bold weight text.</Text>
      <Text weight="extrabold">Extra bold weight text.</Text>
    </div>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <div className="space-y-2">
      <Text variant="default">Default variant text.</Text>
      <Text variant="muted">Muted variant text for secondary information.</Text>
      <Text variant="destructive">Destructive variant for warnings or errors.</Text>
      <Text variant="success">Success variant for positive messaging.</Text>
    </div>
  ),
};

export const BlockquoteTypography: Story = {
  render: () => (
    <Blockquote>
      &ldquo;This is a blockquote for highlighting important information or quotes.&rdquo;
    </Blockquote>
  ),
};

export const UnorderedListTypography: Story = {
  render: () => (
    <UnorderedList>
      <li>Unordered list item 1</li>
      <li>Unordered list item 2</li>
      <li>Unordered list item 3</li>
    </UnorderedList>
  ),
};

export const OrderedListTypography: Story = {
  render: () => (
    <OrderedList>
      <li>Ordered list item 1</li>
      <li>Ordered list item 2</li>
      <li>Ordered list item 3</li>
    </OrderedList>
  ),
};

export const CodeSnippetStory: Story = {
  render: () => <CodeSnippet>{`const hello = "world";`}</CodeSnippet>,
};
