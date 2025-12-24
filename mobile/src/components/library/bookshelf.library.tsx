import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const categories = [
    { id: 1, icon: 'newspaper-outline', name: 'Bài báo', subtitle: '6 mục' },
    { id: 2, icon: 'document-text-outline', name: 'Tóm tắt', subtitle: 'Không có mục nào' },
    { id: 3, icon: 'library-outline', name: 'Sách', subtitle: 'Không có mục nào' },
    { id: 4, icon: 'archive-outline', name: 'Lưu trữ', subtitle: 'Không có mục nào' },
    { id: 5, icon: 'trash-outline', name: 'Thùng rác', subtitle: 'Không có mục nào' },
];

const CategoryList = () => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {categories.map((item) => (
                <Pressable
                    key={item.id}
                    onPress={() => console.log('Pressed')}
                >
                    {({ pressed }) => (
                        <View style={[styles.item, pressed && styles.pressedItem]}>
                            <Ionicons name={item.icon as any} size={24} color="#222" style={styles.icon} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.subtitle}>{item.subtitle}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.arrow} />
                        </View>
                    )}
                </Pressable>
            ))}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 16, // Tăng margin để shadow có không gian
        marginHorizontal: 10, // Thêm margin ngang cho shadow
        marginVertical: 5,
        // Shadow cho iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,

    },
    icon: {
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
     pressedItem: {
        opacity: 0.8, // hoặc backgroundColor: '#f2f2f2'
    },
    subtitle: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    arrow: {
        marginLeft: 8,
    },
});

export default CategoryList;
