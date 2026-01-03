import type { Meta, StoryObj } from "@storybook/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ReactRenderer } from "@storybook/react";

// Sample data for bar chart
const barChartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

// Sample data for line chart
const lineChartData = [
  { day: "Mon", visitors: 420 },
  { day: "Tue", visitors: 380 },
  { day: "Wed", visitors: 510 },
  { day: "Thu", visitors: 470 },
  { day: "Fri", visitors: 530 },
  { day: "Sat", visitors: 610 },
  { day: "Sun", visitors: 390 },
];

// Sample chart config
const sampleConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(220, 70%, 50%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(160, 60%, 45%)",
  },
  visitors: {
    label: "Visitors",
    color: "hsl(30, 80%, 55%)",
  },
};

const meta = {
  title: "Components/ui/Chart",
  component: ChartContainer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    config: { control: "object" },
    className: { control: "text" },
  },
} satisfies Meta<typeof ChartContainer>;

export default meta;

// Define a story type that uses a render-only approach
type RenderOnlyStory = StoryObj<ReactRenderer>;

export const Default: RenderOnlyStory = {
  render: () => (
    <ChartContainer config={sampleConfig} className="min-h-[300px] w-[500px]">
      <BarChart accessibilityLayer data={barChartData}>
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const WithGrid: RenderOnlyStory = {
  render: () => (
    <ChartContainer config={sampleConfig} className="min-h-[300px] w-[500px]">
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const WithTooltip: RenderOnlyStory = {
  render: () => (
    <ChartContainer config={sampleConfig} className="min-h-[300px] w-[500px]">
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const WithLegend: RenderOnlyStory = {
  render: () => (
    <ChartContainer config={sampleConfig} className="min-h-[300px] w-[500px]">
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const Complete: RenderOnlyStory = {
  render: () => (
    <ChartContainer config={sampleConfig} className="min-h-[300px] w-[500px]">
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const LineChart: RenderOnlyStory = {
  render: () => (
    <ChartContainer config={sampleConfig} className="min-h-[300px] w-[500px]">
      <RechartsLineChart accessibilityLayer data={lineChartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent labelKey="visitors" />} />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="var(--color-visitors)"
          strokeWidth={2}
          dot={{ fill: "var(--color-visitors)" }}
        />
      </RechartsLineChart>
    </ChartContainer>
  ),
};
