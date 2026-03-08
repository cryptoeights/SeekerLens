import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, SHADOWS, SPACING } from '@/lib/constants';
import { SolAmount } from '@/components/ui/SolAmount';

export interface ContentGridItem {
  readonly id: string;
  readonly imageUri: string;
  readonly solPrice: number;
  readonly onPress?: () => void;
}

interface ContentGridProps {
  readonly items: readonly ContentGridItem[];
  readonly onItemPress?: (id: string) => void;
}

const GAP = SPACING.sm;
const COLUMNS = 2;
const SCREEN_PADDING = SPACING.screenPadding;

function getItemWidth(): number {
  const screenWidth = Dimensions.get('window').width;
  return (screenWidth - SCREEN_PADDING * 2 - GAP) / COLUMNS;
}

function ContentGridTile({ item, onPress }: { readonly item: ContentGridItem; readonly onPress?: () => void }) {
  const itemWidth = getItemWidth();

  return (
    <TouchableOpacity
      style={[styles.tile, { width: itemWidth }]}
      onPress={onPress ?? item.onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={[styles.image, { width: itemWidth, height: itemWidth * 1.2 }]}
      />
      <View style={styles.priceOverlay}>
        <SolAmount amount={item.solPrice} size="sm" />
      </View>
    </TouchableOpacity>
  );
}

export function ContentGrid({ items, onItemPress }: ContentGridProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={COLUMNS}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <ContentGridTile
          item={item}
          onPress={onItemPress ? () => onItemPress(item.id) : undefined}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
  tile: {
    borderRadius: SPACING.cardRadius,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceSecondary,
    ...SHADOWS.card,
  },
  image: {
    resizeMode: 'cover',
  },
  priceOverlay: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
  },
});
