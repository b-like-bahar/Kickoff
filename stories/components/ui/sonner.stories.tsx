import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "Components/ui/Sonner",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => {},
              },
            })
          }
        >
          Show Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const Success: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={() =>
            toast.success("Profile updated successfully", {
              description: "Your profile information has been updated.",
            })
          }
        >
          Show Success Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const Error: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="destructive"
          onClick={() =>
            toast.error("Failed to save changes", {
              description: "Please try again or contact support if the issue persists.",
            })
          }
        >
          Show Error Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            const toastId = toast.loading("Saving changes...");

            // Simulate a delay
            setTimeout(() => {
              toast.success("Changes saved successfully", {
                id: toastId,
                description: "Your changes have been saved.",
              });
            }, 2000);
          }}
        >
          Show Loading Toast
        </Button>
        <Toaster />
      </div>
    );
  },
};
