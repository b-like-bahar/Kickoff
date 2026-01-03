import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

const meta = {
  title: "Components/ui/Command",
  component: Command,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

const commandsItems1 = [
  {
    value: "item1",
    emoji: "👋",
  },
  {
    value: "item2",
    emoji: "🔍",
  },
  {
    value: "item3",
    emoji: "🚀",
  },
];

const commandsItems2 = [
  {
    value: "item4",
    emoji: "🎮",
  },
  {
    value: "item5",
    emoji: "🌈",
  },
  {
    value: "item6",
    emoji: "🍕",
  },
];

export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions1">
          {commandsItems1.map(item => (
            <CommandItem key={item.value} disabled={item.value === "item3"}>
              <span>{item.emoji}</span>
              <span>{item.value}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Suggestions2">
          {commandsItems2.map(item => (
            <CommandItem key={item.value}>
              <span>{item.emoji}</span>
              <span>{item.value}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
