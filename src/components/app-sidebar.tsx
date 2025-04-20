"use client"

import * as React from "react"
import {
  AudioWaveform,
  // BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  // Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { WhatsAppAccountSwitcher } from "@/components/whatsapp-account-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Prabhjeet Singh",
    email: "prabhjeetsingh1013@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Prabhjeet Singh - Business",
      logo: GalleryVerticalEnd, // Or maybe a WhatsApp icon
      plan: "Business Account",
    },
    {
      name: "Support Team WhatsApp",
      logo: AudioWaveform,
      plan: "Personal Account",
    },
    {
      name: "Marketing Bot",
      logo: Command,
      plan: "Auto Reply",
    },
  ]
,
  navMain: [
    {
      title: "Bulk Sender",
      url: "/dashboard/bulk-sender",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Send Messages",
          url: "/dashboard/bulk-sender/send",
        },
        {
          title: "Campaign Reports",
          url: "/dashboard/bulk-sender/reports",
        },
      ],
    },
    {
      title: "Group Tools",
      url: "/dashboard/groups",
      icon: Frame,
      items: [
        {
          title: "Group Messenger",
          url: "/dashboard/groups/messenger",
        },
        {
          title: "Group Member Grabber",
          url: "/dashboard/groups/grabber",
        },
        {
          title: "Group Finder",
          url: "/dashboard/groups/finder",
        },
        {
          title: "Auto Group Joiner",
          url: "/dashboard/groups/joiner",
        },
      ],
    },
    {
      title: "Lead Tools",
      url: "/dashboard/leads",
      icon: PieChart,
      items: [
        {
          title: "Google Lead Extractor",
          url: "/dashboard/leads/google",
        },
        {
          title: "Website Link Scraper",
          url: "/dashboard/leads/scraper",
        },
        {
          title: "WhatsApp Number Filter",
          url: "/dashboard/leads/number-filter",
        },
      ],
    },
    {
      title: "Smart Tools",
      url: "/dashboard/smart-tools",
      icon: Bot,
      items: [
        {
          title: "Chatbot / Auto Responder",
          url: "/dashboard/smart-tools/chatbot",
        },
        {
          title: "Smart Delay System",
          url: "/dashboard/smart-tools/smart-delay",
        },
      ],
    },
    {
      title: "Utilities",
      url: "/dashboard/utilities",
      icon: Map,
      items: [
        {
          title: "Contacts Grabber",
          url: "/dashboard/utilities/contacts",
        },
        {
          title: "Chat List Grabber",
          url: "/dashboard/utilities/chat-list",
        },
        {
          title: "Bulk Group Generator",
          url: "/dashboard/utilities/group-generator",
        },
      ],
    },
  ]
  ,
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WhatsAppAccountSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
