import { ViewStyle } from 'react-native';

// Ombre morbide intonate alla palette (verde avocado scuro invece del nero puro)
// per dare un senso di profondità premium senza stonare con i toni caldi dell'app.
export const shadow: Record<'sm' | 'md' | 'lg', ViewStyle> = {
  sm: {
    shadowColor: '#3F5233',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#3F5233',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  lg: {
    shadowColor: '#3F5233',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
};
