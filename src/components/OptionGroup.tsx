import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { Chip } from './Chip';

export type Option = { id: string; label: string };

type Props = {
  options: Option[];
  visibleCount: number;
  selected: string[];
  onToggle: (id: string) => void;
  otherLabel?: string;
  lessLabel?: string;
};

// Mostra le prime `visibleCount` opzioni + pulsante "Altro" per le restanti.
// Le selezioni fatte tra le opzioni extra restano visibili come chip anche a pannello chiuso.
export function OptionGroup({ options, visibleCount, selected, onToggle, otherLabel = 'Altro', lessLabel = 'Meno' }: Props) {
  const [expanded, setExpanded] = useState(false);

  const base = options.slice(0, visibleCount);
  const extra = options.slice(visibleCount);
  const selectedExtra = extra.filter((o) => selected.includes(o.id));
  const unselectedExtra = extra.filter((o) => !selected.includes(o.id));

  return (
    <View>
      <View style={styles.wrap}>
        {base.map((o) => (
          <Chip key={o.id} label={o.label} selected={selected.includes(o.id)} onPress={() => onToggle(o.id)} />
        ))}
        {selectedExtra.map((o) => (
          <Chip key={o.id} label={o.label} selected onPress={() => onToggle(o.id)} />
        ))}
        {unselectedExtra.length > 0 && (
          <Chip label={expanded ? lessLabel : otherLabel} onPress={() => setExpanded((e) => !e)} />
        )}
      </View>
      {expanded && (
        <View style={[styles.wrap, styles.extraWrap]}>
          {unselectedExtra.map((o) => (
            <Chip key={o.id} label={o.label} onPress={() => onToggle(o.id)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  extraWrap: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
});
