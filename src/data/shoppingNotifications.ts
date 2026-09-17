import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { WEEKDAYS } from './constants';

// Corrispondenza tra il giorno scelto (in italiano) e il valore "weekday" atteso
// dal trigger a calendario di Expo Notifications: 1 = Domenica, 2 = Lunedì, ... 7 = Sabato
// (converte a partire da Date.getDay(), dove 0 = Domenica).
const JS_DAY_FOR_ITALIAN: Record<string, number> = {
  Domenica: 0,
  Lunedì: 1,
  Martedì: 2,
  Mercoledì: 3,
  Giovedì: 4,
  Venerdì: 5,
  Sabato: 6,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Promemoria spesa: notifica locale reale (nessun backend), schedulata ogni
// settimana in ciascuno dei giorni scelti dal profilo (uno o piu'). Su web le
// notifiche locali non sono supportate allo stesso modo: l'operazione viene
// saltata silenziosamente.
export async function scheduleShoppingReminder(giorni: string[], previousIds: string[]): Promise<string[]> {
  if (Platform.OS === 'web') return [];

  try {
    await Promise.all(previousIds.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => {})));

    const validDays = giorni.filter((g) => WEEKDAYS.includes(g));
    if (validDays.length === 0) return [];

    const { status: existing } = await Notifications.getPermissionsAsync();
    let granted = existing === 'granted';
    if (!granted) {
      const { status } = await Notifications.requestPermissionsAsync();
      granted = status === 'granted';
    }
    if (!granted) return [];

    const ids = await Promise.all(
      validDays.map((giorno) => {
        const weekday = JS_DAY_FOR_ITALIAN[giorno] + 1;
        return Notifications.scheduleNotificationAsync({
          content: {
            title: 'Promemoria spesa',
            body: `Oggi è ${giorno}: è uno dei giorni che hai scelto per fare la spesa!`,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour: 9,
            minute: 0,
          },
        });
      })
    );
    return ids;
  } catch {
    return [];
  }
}

export async function cancelShoppingReminders(ids: string[]) {
  if (ids.length === 0) return;
  try {
    await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  } catch {
    // ignore
  }
}
