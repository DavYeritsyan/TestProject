import { View, StyleSheet } from 'react-native';

export const ReminderIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <View style={[styles.bellCircle, { borderColor: color }]} />
    <View style={[styles.bellDot, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
    iconContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bellCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
    },
    bellDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        position: 'absolute',
        top: 6,
        left: 9,
    },
});