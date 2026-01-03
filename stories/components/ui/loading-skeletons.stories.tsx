import type { Meta, StoryObj } from "@storybook/react";
import {
  MainContentWithSidebarSkeleton,
  TweetCardSkeleton,
  TweetListSkeleton,
  SettingsCardSkeleton,
  FormSkeleton,
  ProfileSkeleton,
} from "@/components/ui/loading-skeletons";

const meta = {
  title: "Components/ui/Loading Skeletons",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const MainContentWithSidebar: StoryObj = {
  render: () => (
    <div className="w-full max-w-4xl">
      <MainContentWithSidebarSkeleton mainContentRows={5} sidebarRows={4} />
    </div>
  ),
};

export const TweetCard: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <TweetCardSkeleton />
    </div>
  ),
};

export const TweetList: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <TweetListSkeleton count={3} />
    </div>
  ),
};

export const SettingsCard: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <SettingsCardSkeleton />
    </div>
  ),
};

export const Form: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <FormSkeleton rows={3} />
    </div>
  ),
};

export const Profile: StoryObj = {
  render: () => (
    <div className="w-full max-w-md">
      <ProfileSkeleton />
    </div>
  ),
};

export const AllComponents: StoryObj = {
  render: () => (
    <div className="space-y-8 w-full max-w-4xl">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Main Content with Sidebar</h3>
        <MainContentWithSidebarSkeleton mainContentRows={3} sidebarRows={2} />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Tweet List</h3>
        <TweetListSkeleton count={2} />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Settings Card</h3>
        <SettingsCardSkeleton />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Form</h3>
        <FormSkeleton rows={2} />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Profile</h3>
        <ProfileSkeleton />
      </div>
    </div>
  ),
};
