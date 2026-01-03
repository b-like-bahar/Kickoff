import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

const meta = {
  title: "Components/ui/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = Array.from({ length: 30 }).map((_, i, a) => `item ${a.length - i}`);

export const Default: Story = {
  render: args => (
    <Select {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Items</SelectLabel>
          <SelectItem value="item 1">item 1</SelectItem>
          <SelectItem value="item 2">item 2</SelectItem>
          <SelectItem value="item 3">item 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Scrollable: Story = {
  render: args => (
    <Select {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Items</SelectLabel>
          {items.map(item => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: args => (
    <Select disabled {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="item 1">item 1</SelectItem>
          <SelectItem value="item 2">item 2</SelectItem>
          <SelectItem value="item 3">item 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithDisabledItems: Story = {
  render: args => (
    <Select {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="item 1">item 1</SelectItem>
          <SelectItem value="item 2" disabled>
            item 2 (Out of Stock)
          </SelectItem>
          <SelectItem value="item 3">item 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

const FormSchema = z.object({
  item: z.string({
    required_error: "Please select an item to display.",
  }),
});

function SelectItemForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("You submitted the following values:", {
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="item"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Items</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[250px]" value={field.value || ""}>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="item 1">item 1</SelectItem>
                    <SelectItem value="item 2">item 2</SelectItem>
                    <SelectItem value="item 3">item 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select an item from the list</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}

export const InForm: Story = {
  render: () => <SelectItemForm />,
};
