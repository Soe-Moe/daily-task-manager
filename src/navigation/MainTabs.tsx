import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/types/navigation';
import { Screens } from '@/constants/screens';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { TasksScreen } from '@/screens/tasks/TasksScreen';
import { ArchivedScreen } from '@/screens/archived/ArchivedScreen';
import { SearchScreen } from '@/screens/search/SearchScreen';
import { GlassTabBar } from './GlassTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tab.Screen name={Screens.HOME} component={HomeScreen} />
      <Tab.Screen name={Screens.TASKS} component={TasksScreen} />
      <Tab.Screen name={Screens.ARCHIVED} component={ArchivedScreen} />
      <Tab.Screen name={Screens.SEARCH} component={SearchScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
