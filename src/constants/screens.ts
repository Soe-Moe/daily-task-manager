export const Screens = {
  // Root
  MAIN_TABS: 'MainTabs',
  ADD_TASK: 'AddTask',

  // Tabs
  HOME: 'Home',
  TASKS: 'Tasks',
  ARCHIVED: 'Archived',
  SEARCH: 'Search',
} as const;

export type ScreenName = (typeof Screens)[keyof typeof Screens];
