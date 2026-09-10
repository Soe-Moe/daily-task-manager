import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Screens } from '@/constants/screens';

export type MainTabParamList = {
  [Screens.HOME]: undefined;
  [Screens.TASKS]: undefined;
  [Screens.ARCHIVED]: undefined;
  [Screens.SEARCH]: undefined;
};

export type RootStackParamList = {
  [Screens.MAIN_TABS]: NavigatorScreenParams<MainTabParamList>;
  [Screens.ADD_TASK]: { taskId?: string } | undefined;
};

// Typed screen props helpers
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
