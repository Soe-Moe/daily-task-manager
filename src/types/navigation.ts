import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { Screens } from '@/constants/screens';

export type MainTabParamList = {
  [Screens.HOME]: undefined;
  [Screens.TASKS]: undefined;
  [Screens.EVENTS]: undefined;
  [Screens.ARCHIVED]: undefined;
  [Screens.SEARCH]: undefined;
};

export type RootStackParamList = {
  [Screens.MAIN_TABS]: NavigatorScreenParams<MainTabParamList>;
  [Screens.ADD_TASK]: { taskId?: string } | undefined;
  [Screens.TASK_DETAIL]: { taskId: string };
};

// Typed screen props helpers
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  NativeBottomTabScreenProps<MainTabParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
