import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

const categories = [
    { id: 1, emoji: '💬', name: 'Hội thoại', subtitle: '4 mục' },
    { id: 2, emoji: '🍿', name: 'Phim ảnh', subtitle: '3 mục' },
    { id: 3, emoji: '👩‍❤️‍👨', name: 'Mối quan hệ', subtitle: '2 mục' },
    { id: 4, emoji: '🎬', name: 'Thông tin thú vị', subtitle: '1 mục' },
    { id: 5, emoji: '✈️', name: 'Du lịch', subtitle: '2 mục' },
    { id: 6, emoji: '👨‍💻', name: 'Công việc', subtitle: '1 mục' },
    { id: 7, emoji: '🥑', name: 'Thực phẩm', subtitle: '1 mục' },
];

const TagLibrary = () => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {categories.map((item) => (
                <Pressable
                    key={item.id}
                    onPress={() => console.log(`Pressed ${item.name}`)}
                >
                    {({ pressed }) => (
                        <View style={[styles.item, pressed && styles.pressedItem]}>
                            <Text style={styles.emoji}>{item.emoji}</Text>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.subtitle}>{item.subtitle}</Text>
                            </View>
                            <Text style={styles.arrow}>›</Text>
                        </View>
                    )}
                </Pressable>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 10,
        marginHorizontal: 2,
        // Shadow iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        // Shadow Android
        elevation: 2,
    },
    pressedItem: {
        opacity: 0.85,
    },
    emoji: {
        fontSize: 24,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    subtitle: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    arrow: {
        fontSize: 18,
        color: '#999',
        marginLeft: 8,
    },
});

export default TagLibrary;
