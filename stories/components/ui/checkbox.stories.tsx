import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast, Toaster } from "sonner";

const meta = {
  title: "Components/ui/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    onCheckedChange: { action: "checked changed" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultCheckbox(args: any) {
  const [isChecked, setIsChecked] = useState(args.checked || false);

  const handleCheckedChange = (checked: CheckedState) => {
    setIsChecked(checked === true);
    if (args.onCheckedChange) {
      args.onCheckedChange(checked);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="default-checkbox"
        {...args}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
      />
      <Label htmlFor="default-checkbox">Accept terms and conditions</Label>
    </div>
  );
}

export const Default: Story = {
  args: {
    checked: false,
  },
  render: args => <DefaultCheckbox {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: args => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-checkbox" {...args} />
      <Label htmlFor="disabled-checkbox" className="text-muted-foreground">
        This checkbox is disabled
      </Label>
    </div>
  ),
};

const FormSchemaSingle = z.object({
  mobile: z.boolean().default(false).optional(),
});

function CheckboxFormSingle() {
  const form = useForm<z.infer<typeof FormSchemaSingle>>({
    resolver: zodResolver(FormSchemaSingle),
    defaultValues: {
      mobile: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchemaSingle>) {
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
            name="mobile"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Use different settings for my mobile devices</FormLabel>
                  <FormDescription>
                    You can manage your mobile notifications in the mobile settings.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}

export const SingleCheckboxInForm: Story = {
  args: {
    disabled: false,
    required: true,
  },
  render: () => <CheckboxFormSingle />,
};

const sidebarItems = [
  { id: "recents", label: "Recents" },
  { id: "home", label: "Home" },
  { id: "applications", label: "Applications" },
] as const;

const FormSchemaMultiple = z.object({
  items: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one item.",
  }),
});

function CheckboxFormMultiple() {
  const form = useForm<z.infer<typeof FormSchemaMultiple>>({
    resolver: zodResolver(FormSchemaMultiple),
    defaultValues: {
      items: ["recents", "home"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchemaMultiple>) {
    toast.success("You submitted the following values:", {
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Sidebar</FormLabel>
                  <FormDescription>
                    Select the items you want to display in the sidebar.
                  </FormDescription>
                </div>
                {sidebarItems.map(item => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(field.value?.filter(value => value !== item.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
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

export const MultipleCheckboxesInForm: Story = {
  render: () => <CheckboxFormMultiple />,
};
