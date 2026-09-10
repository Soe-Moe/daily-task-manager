import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Screens } from '@/constants/screens';
import { MainTabs } from './MainTabs';
import { AddEditTaskScreen } from '@/screens/task/AddEditTaskScreen';

// Re-export RootStackParamList for direct access
export type { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.MAIN_TABS} component={MainTabs} />
      <Stack.Screen
        name={Screens.ADD_TASK}
        component={AddEditTaskScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
