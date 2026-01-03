import type { Meta, StoryObj } from "@storybook/react";
import {
  Save,
  Cloud,
  CreditCard,
  Settings,
  User,
  Mail,
  MessageSquare,
  Plus,
  BookOpen,
  LifeBuoy,
  LogOut,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

const meta = {
  title: "Components/ui/Menubar",
  component: Menubar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menubar className="w-full">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Select All <MenubarShortcut>⌘A</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="personal">
            <MenubarRadioItem value="personal">Personal</MenubarRadioItem>
            <MenubarRadioItem value="work">Work</MenubarRadioItem>
            <MenubarRadioItem value="school">School</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem>Edit Profiles...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Menubar className="w-full">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Save className="mr-2 h-4 w-4" />
            Save
          </MenubarItem>
          <MenubarItem>
            <Cloud className="mr-2 h-4 w-4" />
            Save to Cloud
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Bold className="mr-2 h-4 w-4" />
            Bold
            <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Italic className="mr-2 h-4 w-4" />
            Italic
            <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Underline className="mr-2 h-4 w-4" />
            Underline
            <MenubarShortcut>⌘U</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <AlignLeft className="mr-2 h-4 w-4" />
            Align Left
          </MenubarItem>
          <MenubarItem>
            <AlignCenter className="mr-2 h-4 w-4" />
            Align Center
          </MenubarItem>
          <MenubarItem>
            <AlignRight className="mr-2 h-4 w-4" />
            Align Right
          </MenubarItem>
          <MenubarItem>
            <AlignJustify className="mr-2 h-4 w-4" />
            Justify
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Account</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarItem>
            <User className="mr-2 h-4 w-4" />
            Profile
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>
              <User className="mr-2 h-4 w-4" />
              More
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </MenubarItem>
              <MenubarItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Plus className="mr-2 h-4 w-4" />
                More
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <BookOpen className="mr-2 h-4 w-4" />
            Documentation
          </MenubarItem>
          <MenubarItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            Support
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
            <MenubarShortcut>⇧⌘Q</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
