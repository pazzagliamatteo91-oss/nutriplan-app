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
// settimana nel giorno scelto dal profilo. Su web le notifiche locali non sono
// supportate allo stesso modo: l'operazione viene saltata silenziosamente.
export async function scheduleShoppingReminder(giorno: string, previousId: string | null): Promise<string | null> {
  if (Platform.OS === 'web' || !WEEKDAYS.includes(giorno)) return null;

  try {
    if (previousId) {
      await Notifications.cancelScheduledNotificationAsync(previousId).catch(() => {});
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let granted = existing === 'granted';
    if (!granted) {
      const { status } = await Notifications.requestPermissionsAsync();
      granted = status === 'granted';
    }
    if (!granted) return null;

    const weekday = JS_DAY_FOR_ITALIAN[giorno] + 1;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Promemoria spesa',
        body: `Oggi è ${giorno}: è il giorno che hai scelto per fare la spesa!`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour: 9,
        minute: 0,
      },
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelShoppingReminder(id: string | null) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // ignore
  }
}
