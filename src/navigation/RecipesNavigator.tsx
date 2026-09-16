import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipesStackParamList } from './types';
import { RecipesListScreen } from '../screens/RecipesListScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { MealPlanScreen } from '../screens/MealPlanScreen';

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export function RecipesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecipesList" component={RecipesListScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="MealPlan" component={MealPlanScreen} />
    </Stack.Navigator>
  );
}
