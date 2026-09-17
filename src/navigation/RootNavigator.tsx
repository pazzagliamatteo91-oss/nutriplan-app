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
import { useApp } from '../context/AppContext';

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
    primary: colors.highlight,
  },
};

export function RootNavigator() {
  const { t } = useApp();
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
          tabBarActiveTintColor: colors.highlight,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter_500Medium' },
          tabBarIcon: ({ focused, size }) => (
            <ColorIcon name={TAB_ICONS[route.name as keyof RootTabParamList]} focused={focused} size={size ? size + 2 : 24} />
          ),
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: t('nav.home') }} />
        <Tab.Screen name="RicetteTab" component={RecipesNavigator} options={{ title: t('nav.recipes') }} />
        <Tab.Screen name="SpesaTab" component={ShoppingScreen} options={{ title: t('nav.shopping') }} />
        <Tab.Screen name="AnalisiTab" component={AnalysisScreen} options={{ title: t('nav.analysis') }} />
        <Tab.Screen name="AllenamentoTab" component={WorkoutScreen} options={{ title: t('nav.workout') }} />
        <Tab.Screen name="ProfiloTab" component={ProfileScreen} options={{ title: t('nav.profile') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const StyleSheetHairline = 0.5;
