import type { Meta, StoryObj } from "@storybook/react";
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const meta = {
  title: "Components/ui/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showOutsideDays: { control: "boolean" },
    mode: { control: "select", options: ["default", "range", "multiple", "single"] },
    disabled: { control: "boolean" },
    captionLayout: { control: "select", options: ["dropdown", "buttons"] },
    fromYear: { control: "number" },
    toYear: { control: "number" },
    initialFocus: { control: "boolean" },
  },
  args: {
    className: "rounded-md border",
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Components for stories
const DefaultCalendar = (args: any) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="p-4 bg-background rounded-lg">
      <Calendar {...args} mode="single" selected={date} onSelect={setDate} />
      {date && <p className="mt-4 text-sm text-center">Selected: {date.toDateString()}</p>}
    </div>
  );
};

const RangeCalendar = (args: any) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <>
      <div className="p-4 bg-background rounded-lg">
        <Calendar {...args} mode="range" selected={dateRange} onSelect={setDateRange} />
      </div>
      {dateRange?.from && (
        <p className="text-sm text-center">
          Range: {dateRange.from.toDateString()}
          {dateRange.to && ` - ${dateRange.to.toDateString()}`}
        </p>
      )}
    </>
  );
};

const MultipleCalendar = (args: any) => {
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(),
    addDays(new Date(), 3),
    addDays(new Date(), 7),
  ]);

  return (
    <>
      <div className="p-4 bg-background rounded-lg">
        <Calendar {...args} mode="multiple" selected={dates} onSelect={setDates} />
      </div>
      {dates && dates.length > 0 && (
        <p className="text-sm text-center">Selected {dates.length} date(s)</p>
      )}
    </>
  );
};

const DisabledDatesCalendar = (args: any) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="p-4 bg-background rounded-lg max-w-[290px]">
      <Calendar {...args} mode="single" selected={date} onSelect={setDate} />
      <p className="mt-4 text-sm">
        Dates between {addDays(new Date(), 5).toDateString()} and{" "}
        {addDays(new Date(), 10).toDateString()} are disabled
      </p>
      {date && <p className="mt-2 text-sm">Selected: {date.toDateString()}</p>}
    </div>
  );
};

export const Default: Story = {
  args: {
    mode: "single",
  },
  render: args => <DefaultCalendar {...args} />,
};

export const RangeSelection: Story = {
  args: {
    mode: "range",
  },
  render: args => <RangeCalendar {...args} />,
};

export const MultipleSelection: Story = {
  args: {
    mode: "multiple",
  },
  render: args => <MultipleCalendar {...args} />,
};

export const DisabledDates: Story = {
  args: {
    mode: "single",
    disabled: [{ from: addDays(new Date(), 5), to: addDays(new Date(), 10) }],
    defaultMonth: new Date(),
  },
  render: args => <DisabledDatesCalendar {...args} />,
};

export const DisabledCalendar: Story = {
  args: {
    mode: "single",
    disabled: true,
  },
  render: args => (
    <div className="p-4 bg-background rounded-lg">
      <Calendar {...args} />
      <p className="mt-4 text-sm text-center">The entire calendar is disabled</p>
    </div>
  ),
};
