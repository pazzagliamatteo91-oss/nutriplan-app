import React, { useRef, useState, useCallback } from 'react';
import { Animated, View, Text, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { colors, fonts, radii } from '../theme';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

type Props<T> = {
  data: T[];
  selectedIndex: number;
  onChange: (index: number) => void;
  labelExtractor: (item: T) => string;
};

// Selettore a rotella in stile iOS, costruito con FlatList + snapToInterval
// (invece di @react-native-picker/picker, che non replica lo stile nativo iOS).
// Animated.FlatList non tipizza bene i generici quando il tipo T è parametrico sul
// componente: il cast a componente generico evita falsi positivi di TypeScript.
const AnimatedList = Animated.FlatList as unknown as React.ComponentType<any>;

export function WheelPicker<T>({ data, selectedIndex, onChange, labelExtractor }: Props<T>) {
  const scrollY = useRef(new Animated.Value(selectedIndex * ITEM_HEIGHT)).current;
  const listRef = useRef<any>(null);
  const [current, setCurrent] = useState(selectedIndex);

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(data.length - 1, index));
      setCurrent(clamped);
      onChange(clamped);
    },
    [data.length, onChange]
  );

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToOffset({ offset: index * ITEM_HEIGHT, animated: true });
    // Aggiorna subito la selezione al tocco: non aspetta la fine dello scroll
    // animato, che su web può non scattare in tempo se si conferma subito dopo.
    const clamped = Math.max(0, Math.min(data.length - 1, index));
    setCurrent(clamped);
    onChange(clamped);
  };

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.centerBand} />
      <AnimatedList
        ref={listRef}
        data={data}
        keyExtractor={(_: T, i: number) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        initialScrollIndex={selectedIndex}
        getItemLayout={(_: T[] | null | undefined, index: number) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        contentContainerStyle={{ paddingVertical: PADDING }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index }: { item: T; index: number }) => {
          const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
          ];
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.2, 0.45, 1, 0.45, 0.2],
            extrapolate: 'clamp',
          });
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.8, 0.9, 1.12, 0.9, 0.8],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={[styles.item, { opacity, transform: [{ scale }] }]}
            >
              <Text
                onPress={() => scrollToIndex(index)}
                style={[styles.itemText, index === current && styles.itemTextActive]}
              >
                {labelExtractor(item)}
              </Text>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
  },
  centerBand: {
    position: 'absolute',
    top: PADDING,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: radii.md,
    backgroundColor: colors.panelAlt,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.textMuted,
  },
  itemTextActive: {
    fontFamily: fonts.bodySemiBold,
    color: colors.text,
  },
});
