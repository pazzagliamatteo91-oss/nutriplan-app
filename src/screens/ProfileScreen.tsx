import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, spacing } from '../theme';
import { Avatar } from '../components/Avatar';
import { AvatarPickerModal } from '../components/AvatarPickerModal';
import { Card } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { ListRow } from '../components/ListRow';
import { OptionGroup, Option } from '../components/OptionGroup';
import { WheelPickerModal } from '../components/WheelPickerModal';
import { AvocadoWaveHeader } from '../components/AvocadoWaveHeader';
import { IconName } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { CUISINES, RESTRICTIONS, INTOLERANCES, ALLERGIES, LIFESTYLES, GOALS } from '../data/constants';
import { LANGUAGES, LanguageCode, OptionDict } from '../i18n';

type PickerKey = 'eta' | 'peso' | 'altezza' | 'kcal' | 'proteine' | 'stileVita' | 'obiettivo' | 'lingua' | null;

const HEADER_HEIGHT = 170;

const ETA_OPTIONS = Array.from({ length: 90 - 14 + 1 }, (_, i) => 14 + i);
const PESO_OPTIONS = Array.from({ length: 180 - 30 + 1 }, (_, i) => 30 + i);
const ALTEZZA_OPTIONS = Array.from({ length: 220 - 130 + 1 }, (_, i) => 130 + i);
const KCAL_OPTIONS = Array.from({ length: (4000 - 1200) / 50 + 1 }, (_, i) => 1200 + i * 50);
const PROTEINE_OPTIONS = Array.from({ length: (250 - 40) / 5 + 1 }, (_, i) => 40 + i * 5);

function translateOptions(options: Option[], dict: OptionDict): Option[] {
  return options.map((o) => ({ ...o, label: dict[o.id] ?? o.label }));
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile, toggleListMember, language, setLanguage, t, locale } = useApp();
  const [activePicker, setActivePicker] = useState<PickerKey>(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [draftName, setDraftName] = useState(profile.nome);

  const pickerConfig = useMemo((): {
    title: string;
    data: any[];
    value: any;
    format: (v: any) => string;
  } | null => {
    switch (activePicker) {
      case 'eta':
        return { title: t('profile.age'), data: ETA_OPTIONS, value: profile.eta, format: (v: number) => t('profile.ageUnit', { n: v }) };
      case 'peso':
        return { title: t('profile.weight'), data: PESO_OPTIONS, value: profile.pesoKg, format: (v: number) => `${v} kg` };
      case 'altezza':
        return { title: t('profile.height'), data: ALTEZZA_OPTIONS, value: profile.altezzaCm, format: (v: number) => `${v} cm` };
      case 'kcal':
        return { title: t('profile.kcalDay'), data: KCAL_OPTIONS, value: profile.kcalGiorno, format: (v: number) => `${v} kcal` };
      case 'proteine':
        return { title: t('profile.proteinDay'), data: PROTEINE_OPTIONS, value: profile.proteineGiorno, format: (v: number) => `${v} g` };
      case 'stileVita':
        return { title: t('profile.lifestyle'), data: LIFESTYLES, value: profile.stileVita, format: (v: string) => locale.lifestyles[v] ?? v };
      case 'obiettivo':
        return { title: t('profile.goal'), data: GOALS, value: profile.obiettivo, format: (v: string) => locale.goals[v] ?? v };
      case 'lingua':
        return { title: t('profile.language'), data: LANGUAGES, value: LANGUAGES.find((l) => l.code === language), format: (v: { code: LanguageCode; label: string }) => locale.languages[v.code] ?? v.label };
      default:
        return null;
    }
  }, [activePicker, profile, language, t, locale]);

  const confirmPicker = (index: number) => {
    if (!pickerConfig) return;
    const value = pickerConfig.data[index];
    switch (activePicker) {
      case 'eta': updateProfile({ eta: value as number }); break;
      case 'peso': updateProfile({ pesoKg: value as number }); break;
      case 'altezza': updateProfile({ altezzaCm: value as number }); break;
      case 'kcal': updateProfile({ kcalGiorno: value as number }); break;
      case 'proteine': updateProfile({ proteineGiorno: value as number }); break;
      case 'stileVita': updateProfile({ stileVita: value as string }); break;
      case 'obiettivo': updateProfile({ obiettivo: value as string }); break;
      case 'lingua': setLanguage((value as { code: LanguageCode }).code); break;
    }
    setActivePicker(null);
  };

  const cuisines = useMemo(() => translateOptions(CUISINES, locale.cuisines), [locale]);
  const restrictions = useMemo(() => translateOptions(RESTRICTIONS, locale.restrictions), [locale]);
  const intolerances = useMemo(() => translateOptions(INTOLERANCES, locale.intolerances), [locale]);
  const allergies = useMemo(() => translateOptions(ALLERGIES, locale.allergies), [locale]);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { minHeight: insets.top + HEADER_HEIGHT }]}>
        <AvocadoWaveHeader />
        <View style={[styles.headerRow, { marginTop: insets.top + spacing.sm }]}>
          <Avatar
            uri={profile.avatarUri}
            iconName={profile.avatarIcon as IconName}
            size={64}
            editable
            onPress={() => setAvatarModalOpen(true)}
          />
          <Pressable
            onPress={() => {
              setDraftName(profile.nome);
              setNameModalOpen(true);
            }}
            style={{ flex: 1 }}
          >
            <Text style={styles.name}>{profile.nome}</Text>
            <Text style={styles.editHint}>{t('profile.editNameHint')}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title={t('profile.parameters')} />
        <Card style={styles.rowsCard}>
          <ListRow label={t('profile.age')} value={t('profile.ageUnit', { n: profile.eta })} onPress={() => setActivePicker('eta')} />
          <ListRow label={t('profile.weight')} value={`${profile.pesoKg} kg`} onPress={() => setActivePicker('peso')} />
          <ListRow label={t('profile.height')} value={`${profile.altezzaCm} cm`} onPress={() => setActivePicker('altezza')} />
          <ListRow label={t('profile.kcalDay')} value={`${profile.kcalGiorno} kcal`} onPress={() => setActivePicker('kcal')} />
          <ListRow label={t('profile.proteinDay')} value={`${profile.proteineGiorno} g`} onPress={() => setActivePicker('proteine')} />
          <ListRow label={t('profile.lifestyle')} value={locale.lifestyles[profile.stileVita] ?? profile.stileVita} onPress={() => setActivePicker('stileVita')} />
          <ListRow label={t('profile.goal')} value={locale.goals[profile.obiettivo] ?? profile.obiettivo} onPress={() => setActivePicker('obiettivo')} />
          <View style={{ borderBottomWidth: 0 }}>
            <ListRow label={t('profile.language')} value={locale.languages[language]} onPress={() => setActivePicker('lingua')} />
          </View>
        </Card>

        <SectionHeader title={t('profile.intolerances')} />
        <Card style={styles.optionsCard}>
          <OptionGroup
            options={intolerances}
            visibleCount={5}
            selected={profile.intolleranze}
            onToggle={(id) => toggleListMember('intolleranze', id)}
            otherLabel={t('common.other')}
            lessLabel={t('common.less')}
          />
        </Card>

        <SectionHeader title={t('profile.allergies')} />
        <Card style={styles.optionsCard}>
          <OptionGroup
            options={allergies}
            visibleCount={5}
            selected={profile.allergie}
            onToggle={(id) => toggleListMember('allergie', id)}
            otherLabel={t('common.other')}
            lessLabel={t('common.less')}
          />
        </Card>

        <SectionHeader title={t('profile.favoriteCuisine')} />
        <Card style={styles.optionsCard}>
          <OptionGroup
            options={cuisines}
            visibleCount={6}
            selected={profile.cucinePreferite}
            onToggle={(id) => toggleListMember('cucinePreferite', id)}
            otherLabel={t('common.other')}
            lessLabel={t('common.less')}
          />
        </Card>

        <SectionHeader title={t('profile.restrictions')} />
        <Card style={[styles.optionsCard, { marginBottom: spacing.xxl }]}>
          <OptionGroup
            options={restrictions}
            visibleCount={4}
            selected={profile.restrizioni}
            onToggle={(id) => toggleListMember('restrizioni', id)}
            otherLabel={t('common.other')}
            lessLabel={t('common.less')}
          />
        </Card>
      </ScrollView>

      {pickerConfig && (
        <WheelPickerModal
          visible={!!activePicker}
          title={pickerConfig.title}
          data={pickerConfig.data as any[]}
          selectedIndex={Math.max(0, (pickerConfig.data as any[]).indexOf(pickerConfig.value as any))}
          labelExtractor={(v) => pickerConfig.format(v as any)}
          onCancel={() => setActivePicker(null)}
          onConfirm={confirmPicker}
          cancelLabel={t('common.cancel')}
          confirmLabel={t('common.confirm')}
        />
      )}

      <AvatarPickerModal
        visible={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSelectIcon={(icon) => updateProfile({ avatarIcon: icon, avatarUri: null })}
        onSelectPhoto={(uri) => updateProfile({ avatarUri: uri, avatarIcon: null })}
        title={t('profile.chooseAvatarTitle')}
        uploadLabel={t('profile.uploadPhoto')}
        orChooseLabel={t('profile.orChooseIcon')}
      />

      <Modal visible={nameModalOpen} transparent animationType="fade" onRequestClose={() => setNameModalOpen(false)}>
        <View style={styles.nameOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setNameModalOpen(false)} />
          <View style={styles.nameCard}>
            <Text style={styles.nameCardTitle}>{t('profile.editNameTitle')}</Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              style={styles.nameInput}
              placeholder={t('profile.namePlaceholder')}
              placeholderTextColor={colors.textFaint}
              autoFocus
            />
            <View style={styles.nameButtons}>
              <Pressable onPress={() => setNameModalOpen(false)} style={styles.nameCancelBtn}>
                <Text style={styles.nameCancelLabel}>{t('common.cancel')}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  updateProfile({ nome: draftName.trim() || profile.nome });
                  setNameModalOpen(false);
                }}
                style={styles.nameConfirmBtn}
              >
                <Text style={styles.nameConfirmLabel}>{t('common.save')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { fontFamily: fonts.headingBold, fontSize: 22, color: colors.accentText },
  editHint: { fontFamily: fonts.body, fontSize: 12, color: colors.accentText, opacity: 0.7, marginTop: 2 },
  content: { padding: spacing.lg },
  rowsCard: { marginBottom: spacing.lg, paddingVertical: 4 },
  optionsCard: { marginBottom: spacing.lg },
  nameOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.overlay, padding: spacing.lg },
  nameCard: { width: '100%', backgroundColor: colors.panel, borderRadius: radii.lg, padding: spacing.lg },
  nameCardTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, marginBottom: spacing.md },
  nameInput: {
    backgroundColor: colors.panelAlt, borderRadius: radii.md, paddingHorizontal: spacing.md,
    paddingVertical: 12, color: colors.text, fontFamily: fonts.body, fontSize: 15, marginBottom: spacing.md,
  },
  nameButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  nameCancelBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  nameCancelLabel: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14 },
  nameConfirmBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: colors.accent, borderRadius: radii.pill },
  nameConfirmLabel: { fontFamily: fonts.bodySemiBold, color: colors.accentText, fontSize: 14 },
});
