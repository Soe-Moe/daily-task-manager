export const Screens = {
  // Root
  MAIN_TABS: 'MainTabs',
  ADD_TASK: 'AddTask',
  TASK_DETAIL: 'TaskDetail',

  // Tabs
  HOME: 'Home',
  TASKS: 'Tasks',
  ARCHIVED: 'Archived',
  EVENTS: 'Events',
  SEARCH: 'Search',
} as const;

export type ScreenName = (typeof Screens)[keyof typeof Screens];
