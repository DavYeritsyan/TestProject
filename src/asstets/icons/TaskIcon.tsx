import { View, Text, StyleSheet } from 'react-native';

export const TaskIcon = ({ color }: { color: string }) => (
    <View style={styles.iconContainer}>
        <View style={[styles.checkmark, { borderColor: color }]}>
            <Text style={[styles.checkmarkText, { color }]}>✓</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    iconContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -2,
    },
});