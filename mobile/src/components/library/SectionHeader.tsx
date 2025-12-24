import { SectionHeaderProps } from '@/types/eapp';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    viewAll: {
        fontSize: 14,
        color: '#007AFF',
    },
    horizontalScroll: {
        flexDirection: 'row',
        paddingHorizontal: 4,
    },

})
const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity>
            <Text style={styles.viewAll}>Xem tất cả</Text>
        </TouchableOpacity>
    </View>
);

export default SectionHeader;
