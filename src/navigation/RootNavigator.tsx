import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './types';
import { colors } from '../theme';
import { ColorIcon, ColorIconName } from '../components/ColorIcon';
import { HomeScreen } from '../screens/HomeScreen';
import { RecipesNavigator } from './RecipesNavigator';
import { ShoppingScreen } from '../screens/ShoppingScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, ColorIconName> = {
  HomeTab: 'home',
  RicetteTab: 'recipes',
  SpesaTab: 'shopping',
  AnalisiTab: 'analysis',
  AllenamentoTab: 'workout',
  ProfiloTab: 'avocado',
};

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: StyleSheetHairline,
            height: 64,
            paddingTop: 8,
            paddingBottom: 10,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter_500Medium' },
          tabBarIcon: ({ focused, size }) => (
            <ColorIcon name={TAB_ICONS[route.name as keyof RootTabParamList]} focused={focused} size={size ? size + 2 : 24} />
          ),
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="RicetteTab" component={RecipesNavigator} options={{ title: 'Ricette' }} />
        <Tab.Screen name="SpesaTab" component={ShoppingScreen} options={{ title: 'Spesa' }} />
        <Tab.Screen name="AnalisiTab" component={AnalysisScreen} options={{ title: 'Analisi' }} />
        <Tab.Screen name="AllenamentoTab" component={WorkoutScreen} options={{ title: 'Allenamento' }} />
        <Tab.Screen name="ProfiloTab" component={ProfileScreen} options={{ title: 'Profilo' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const StyleSheetHairline = 0.5;
