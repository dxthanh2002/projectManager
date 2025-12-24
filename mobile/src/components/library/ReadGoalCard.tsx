import { StyleSheet, Text, View } from "react-native";


const styles = StyleSheet.create({
    goalCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    goalIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    goalIconText: {
        fontSize: 20,
    },
    goalContent: {
        flex: 1,
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    goalSubtitle: {
        fontSize: 14,
        color: '#666',
    },
})
const ReadGoalCard = () => (
    <View style={styles.goalCard}>
        <View style={styles.goalIcon}>
            <Text style={styles.goalIconText}>📚</Text>
        </View>
        <View style={styles.goalContent}>
            <Text style={styles.goalTitle}>Read goal</Text>
            <Text style={styles.goalSubtitle}>30 minutes every day</Text>
        </View>
    </View>
);
export default ReadGoalCard;