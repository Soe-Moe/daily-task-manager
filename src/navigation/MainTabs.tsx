import React from 'react';
import { Platform } from 'react-native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MainTabParamList } from '@/types/navigation';
import { Screens } from '@/constants/screens';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { TasksScreen } from '@/screens/tasks/TasksScreen';
import { ArchivedScreen } from '@/screens/archived/ArchivedScreen';
import { EventsScreen } from '@/screens/events/EventsScreen';
import { SearchScreen } from '@/screens/search/SearchScreen';
import { useTheme } from '@/utils/useTheme';

const Tab = createNativeBottomTabNavigator<MainTabParamList>();

// react-native-bottom-tabs only understands SF Symbols on iOS; Android needs a
// rasterized ImageSource, which the native BottomNavigationView then tints itself.
const tabIcon =
  (iosSymbol: (focused: boolean) => string, androidGlyph: (focused: boolean) => string) =>
  ({ focused }: { focused: boolean }) =>
    Platform.OS === 'android'
      ? Ionicons.getImageSourceSync(androidGlyph(focused), 24, 'black')
      : { sfSymbol: iosSymbol(focused) };

export const MainTabs: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      translucent
      hapticFeedbackEnabled
      tabBarActiveTintColor={colors.primary}
      tabBarInactiveTintColor={colors.textMuted}
      tabBarStyle={{ backgroundColor: colors.card }}
      screenOptions={{ freezeOnBlur: true }}
    >
      <Tab.Screen
        name={Screens.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: tabIcon(
            (focused) => (focused ? 'house.fill' : 'house'),
            (focused) => (focused ? 'home' : 'home-outline'),
          ),
        }}
      />
      <Tab.Screen
        name={Screens.TASKS}
        component={TasksScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: tabIcon(
            (focused) => (focused ? 'checkmark.circle.fill' : 'checkmark.circle'),
            (focused) => (focused ? 'checkmark-circle' : 'checkmark-circle-outline'),
          ),
        }}
      />
      <Tab.Screen
        name={Screens.EVENTS}
        component={EventsScreen}
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: tabIcon(
            () => 'calendar',
            (focused) => (focused ? 'calendar' : 'calendar-outline'),
          ),
        }}
      />
      <Tab.Screen
        name={Screens.ARCHIVED}
        component={ArchivedScreen}
        options={{
          tabBarLabel: 'Archived',
          tabBarIcon: tabIcon(
            (focused) => (focused ? 'archivebox.fill' : 'archivebox'),
            (focused) => (focused ? 'archive' : 'archive-outline'),
          ),
        }}
      />
      <Tab.Screen
        name={Screens.SEARCH}
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          role: 'search',
          tabBarIcon: tabIcon(
            () => 'magnifyingglass',
            () => 'search',
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
