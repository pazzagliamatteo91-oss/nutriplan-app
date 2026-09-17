import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, spacing } from '../theme';
import { Button } from '../components/Button';
import { OptionGroup, Option } from '../components/OptionGroup';
import { ColorIcon } from '../components/ColorIcon';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { CUISINES, RESTRICTIONS, INTOLERANCES, ALLERGIES, MAIN_SPORTS, LIFESTYLES, GOALS, WEEKDAYS } from '../data/constants';
import { UserProfile } from '../data/types';
import { OptionDict, LanguageCode } from '../i18n';

type Draft = Pick<
  UserProfile,
  'nome' | 'obiettivo' | 'stileVita' | 'cucinePreferite' | 'restrizioni' | 'intolleranze' | 'allergie' | 'sportPreferiti' | 'giorniSpesa'
>;

type StepId = 'welcome' | 'goal' | 'lifestyle' | 'cuisines' | 'restrictions' | 'intolerances' | 'allergies' | 'sports' | 'shoppingDay' | 'summary';
const STEPS: StepId[] = ['welcome', 'goal', 'lifestyle', 'cuisines', 'restrictions', 'intolerances', 'allergies', 'sports', 'shoppingDay', 'summary'];

function translateOptions(options: Option[], dict: OptionDict): Option[] {
  return options.map((o) => ({ ...o, label: dict[o.id] ?? o.label }));
}

export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile, language, setLanguage, t, locale } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    nome: profile.nome,
    obiettivo: profile.obiettivo,
    stileVita: profile.stileVita,
    cucinePreferite: profile.cucinePreferite,
    restrizioni: profile.restrizioni,
    intolleranze: profile.intolleranze,
    allergie: profile.allergie,
    sportPreferiti: profile.sportPreferiti,
    giorniSpesa: profile.giorniSpesa,
  });

  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const toggle = (field: 'cucinePreferite' | 'restrizioni' | 'intolleranze' | 'allergie' | 'sportPreferiti' | 'giorniSpesa', id: string) => {
    setDraft((d) => {
      const list = d[field];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      return { ...d, [field]: next };
    });
  };

  const finish = (overrides?: Partial<Draft>) => {
    updateProfile({ ...draft, ...overrides, onboardingCompletato: true });
  };

  const goNext = () => {
    if (isLast) {
      finish();
      return;
    }
    setStepIndex((i) => i + 1);
  };
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const cuisines = useMemo(() => translateOptions(CUISINES, locale.cuisines), [locale]);
  const restrictions = useMemo(() => translateOptions(RESTRICTIONS, locale.restrictions), [locale]);
  const intolerances = useMemo(() => translateOptions(INTOLERANCES, locale.intolerances), [locale]);
  const allergies = useMemo(() => translateOptions(ALLERGIES, locale.allergies), [locale]);
  const sports = useMemo(() => translateOptions(MAIN_SPORTS, locale.mainSports), [locale]);

  const none = t('onboarding.noneSelected');

  function SingleChoiceList({
    options,
    value,
    onChange,
  }: {
    options: { id: string; label: string }[];
    value: string;
    onChange: (id: string) => void;
  }) {
    return (
      <View style={{ gap: spacing.sm }}>
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <Pressable key={o.id} onPress={() => onChange(o.id)} style={[styles.choiceRow, selected && styles.choiceRowSelected]}>
              <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>{o.label}</Text>
              <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={styles.stepEyebrow}>{t('onboarding.stepOf', { n: stepIndex, t: STEPS.length - 1 })}</Text>
        <Text style={styles.stepTitle}>{title}</Text>
        {subtitle ? <Text style={styles.stepSubtitle}>{subtitle}</Text> : null}
      </View>
    );
  }

  function renderStepContent() {
    switch (step) {
      case 'welcome':
        return (
          <View style={{ alignItems: 'center', paddingTop: spacing.xl }}>
            <View style={styles.langRow}>
              <Pressable onPress={() => setLanguage('it')} style={[styles.langPill, language === 'it' && styles.langPillActive]}>
                <Text style={[styles.langPillLabel, language === 'it' && styles.langPillLabelActive]}>Italiano</Text>
              </Pressable>
              <Pressable onPress={() => setLanguage('en')} style={[styles.langPill, language === 'en' && styles.langPillActive]}>
                <Text style={[styles.langPillLabel, language === 'en' && styles.langPillLabelActive]}>English</Text>
              </Pressable>
            </View>
            <View style={styles.heroCircle}>
              <ColorIcon name="avocado" size={56} />
            </View>
            <Text style={styles.welcomeTitle}>{t('onboarding.welcomeTitle')}</Text>
            <Text style={styles.welcomeSubtitle}>{t('onboarding.welcomeSubtitle')}</Text>
            <View style={{ width: '100%', marginTop: spacing.xl }}>
              <Text style={styles.label}>{t('onboarding.nameQuestion')}</Text>
              <TextInput
                value={draft.nome}
                onChangeText={(v) => setDraft((d) => ({ ...d, nome: v }))}
                style={styles.nameInput}
                placeholder={t('onboarding.namePlaceholder')}
                placeholderTextColor={colors.textFaint}
              />
            </View>
          </View>
        );
      case 'goal':
        return (
          <>
            <StepHeader title={t('onboarding.goalTitle')} subtitle={t('onboarding.goalSubtitle')} />
            <SingleChoiceList
              options={GOALS.map((g) => ({ id: g, label: locale.goals[g] ?? g }))}
              value={draft.obiettivo}
              onChange={(id) => setDraft((d) => ({ ...d, obiettivo: id }))}
            />
          </>
        );
      case 'lifestyle':
        return (
          <>
            <StepHeader title={t('onboarding.lifestyleTitle')} subtitle={t('onboarding.lifestyleSubtitle')} />
            <SingleChoiceList
              options={LIFESTYLES.map((l) => ({ id: l, label: locale.lifestyles[l] ?? l }))}
              value={draft.stileVita}
              onChange={(id) => setDraft((d) => ({ ...d, stileVita: id }))}
            />
          </>
        );
      case 'cuisines':
        return (
          <>
            <StepHeader title={t('onboarding.cuisinesTitle')} subtitle={t('onboarding.cuisinesSubtitle')} />
            <OptionGroup
              options={cuisines}
              visibleCount={cuisines.length}
              selected={draft.cucinePreferite}
              onToggle={(id) => toggle('cucinePreferite', id)}
              otherLabel={t('common.other')}
              lessLabel={t('common.less')}
            />
          </>
        );
      case 'restrictions':
        return (
          <>
            <StepHeader title={t('onboarding.restrictionsTitle')} subtitle={t('onboarding.restrictionsSubtitle')} />
            <OptionGroup
              options={restrictions}
              visibleCount={restrictions.length}
              selected={draft.restrizioni}
              onToggle={(id) => toggle('restrizioni', id)}
              otherLabel={t('common.other')}
              lessLabel={t('common.less')}
            />
          </>
        );
      case 'intolerances':
        return (
          <>
            <StepHeader title={t('onboarding.intolerancesTitle')} subtitle={t('onboarding.intolerancesSubtitle')} />
            <OptionGroup
              options={intolerances}
              visibleCount={intolerances.length}
              selected={draft.intolleranze}
              onToggle={(id) => toggle('intolleranze', id)}
              otherLabel={t('common.other')}
              lessLabel={t('common.less')}
            />
          </>
        );
      case 'allergies':
        return (
          <>
            <StepHeader title={t('onboarding.allergiesTitle')} subtitle={t('onboarding.allergiesSubtitle')} />
            <OptionGroup
              options={allergies}
              visibleCount={allergies.length}
              selected={draft.allergie}
              onToggle={(id) => toggle('allergie', id)}
              otherLabel={t('common.other')}
              lessLabel={t('common.less')}
            />
          </>
        );
      case 'sports':
        return (
          <>
            <StepHeader title={t('onboarding.sportsTitle')} subtitle={t('onboarding.sportsSubtitle')} />
            <OptionGroup
              options={sports}
              visibleCount={sports.length}
              selected={draft.sportPreferiti}
              onToggle={(id) => toggle('sportPreferiti', id)}
              otherLabel={t('common.other')}
              lessLabel={t('common.less')}
            />
          </>
        );
      case 'shoppingDay':
        return (
          <>
            <StepHeader title={t('onboarding.shoppingDayTitle')} subtitle={t('onboarding.shoppingDaySubtitle')} />
            <OptionGroup
              options={WEEKDAYS.map((w) => ({ id: w, label: locale.weekdays[w] ?? w }))}
              visibleCount={WEEKDAYS.length}
              selected={draft.giorniSpesa}
              onToggle={(id) => toggle('giorniSpesa', id)}
              otherLabel={t('common.other')}
              lessLabel={t('common.less')}
            />
          </>
        );
      case 'summary':
        return (
          <>
            <StepHeader title={t('onboarding.summaryTitle', { n: draft.nome })} subtitle={t('onboarding.summarySubtitle')} />
            <View style={styles.summaryCard}>
              <SummaryRow label={t('onboarding.summaryGoalLabel')} value={locale.goals[draft.obiettivo] ?? draft.obiettivo} />
              <SummaryRow label={t('onboarding.summaryLifestyleLabel')} value={locale.lifestyles[draft.stileVita] ?? draft.stileVita} />
              <SummaryRow
                label={t('onboarding.summaryCuisinesLabel')}
                value={draft.cucinePreferite.length ? draft.cucinePreferite.map((c) => locale.cuisines[c] ?? c).join(', ') : none}
              />
              <SummaryRow
                label={t('onboarding.summarySportsLabel')}
                value={draft.sportPreferiti.length ? draft.sportPreferiti.map((s) => locale.mainSports[s] ?? s).join(', ') : none}
              />
              <SummaryRow
                label={t('onboarding.summaryShoppingDayLabel')}
                value={draft.giorniSpesa.length ? draft.giorniSpesa.map((g) => locale.weekdays[g] ?? g).join(', ') : none}
                last
              />
            </View>
          </>
        );
    }
  }

  function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
    return (
      <View style={[styles.summaryRow, last && { borderBottomWidth: 0 }]}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue} numberOfLines={2}>{value}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        {!isFirst ? (
          <Pressable onPress={goBack} style={styles.backBtn} hitSlop={10}>
            <Icon name="chevronLeft" size={20} color={colors.text} />
          </Pressable>
        ) : (
          <View style={[styles.backBtn, { backgroundColor: 'transparent' }]} />
        )}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }]} />
        </View>
        {isFirst ? (
          <Pressable onPress={() => finish()} hitSlop={10}>
            <Text style={styles.skipLabel}>{t('onboarding.skipAll')}</Text>
          </Pressable>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {renderStepContent()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button label={isLast ? t('onboarding.startButton') : t('onboarding.continueButton')} onPress={goNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.panel, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  skipLabel: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textMuted },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, flexGrow: 1 },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },

  langRow: { flexDirection: 'row', backgroundColor: colors.panel, borderRadius: radii.pill, padding: 3, marginBottom: spacing.xl },
  langPill: { paddingVertical: 7, paddingHorizontal: 18, borderRadius: radii.pill },
  langPillActive: { backgroundColor: colors.accent },
  langPillLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  langPillLabelActive: { color: colors.accentText, fontFamily: fonts.bodySemiBold },

  heroCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: colors.panel,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  welcomeTitle: { fontFamily: fonts.headingBold, fontSize: 25, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  welcomeSubtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20, paddingHorizontal: spacing.md },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  nameInput: {
    backgroundColor: colors.panel, borderRadius: radii.md, paddingHorizontal: spacing.md,
    paddingVertical: 13, color: colors.text, fontFamily: fonts.body, fontSize: 16,
  },

  stepEyebrow: { fontFamily: fonts.bodySemiBold, fontSize: 11.5, color: colors.highlight, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 },
  stepTitle: { fontFamily: fonts.headingBold, fontSize: 22, color: colors.text, marginBottom: spacing.xs },
  stepSubtitle: { fontFamily: fonts.body, fontSize: 13.5, color: colors.textMuted, lineHeight: 19 },

  choiceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.panel, borderRadius: radii.md, paddingVertical: 15, paddingHorizontal: spacing.md,
  },
  choiceRowSelected: { backgroundColor: colors.panelAlt, borderWidth: 1.5, borderColor: colors.highlight },
  choiceLabel: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
  choiceLabelSelected: { fontFamily: fonts.bodySemiBold },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.textFaint, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.highlight },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },

  summaryCard: { backgroundColor: colors.panel, borderRadius: radii.lg, paddingHorizontal: spacing.md },
  summaryRow: {
    paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
    flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md,
  },
  summaryLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted, flexShrink: 0 },
  summaryValue: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.text, flex: 1, textAlign: 'right' },
});
