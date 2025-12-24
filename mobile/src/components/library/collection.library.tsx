import { View, Text, StyleSheet, Image, FlatList, Pressable } from "react-native";
import demo from "@/assets/demo.jpg";
import { APP_COLOR } from "@/utils/constant";

interface IProps {
    name?: string;
    description?: string;
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
    },
    itemContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 0,
        marginRight: 12,
        marginVertical: 8,
        width: 280,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    itemContent: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        borderRadius: 12,
        overflow: 'hidden',
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        lineHeight: 22,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 18,
    },
    image: {
        width: 100,
        height: 130,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    content: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 10,
        backgroundColor: '#FFFFFF',
    },

    duration: {
        fontSize: 13,
        color: '#999999',
    },
    status: {
        fontSize: 13,
        color: '#4A90E2',
        fontWeight: '500',
    },
})

const CollectionLibrary = (props: IProps) => {
    const { name, description } = props;
    const data = [
        {
            key: 1,
            image: demo,
            name: "Learn React Native",
            description: "An introductory course",
            duration: "30 mins",
            status: "In Progress"
        },
        {
            key: 2,
            image: demo,
            name: "Build a Todo App",
            description: "Step-by-step guide",
            duration: "1 hour",
            status: "Completed"
        },
        {
            key: 3,
            image: demo,
            name: "Master JavaScript",
            description: "Tips and tricks",
            duration: "45 mins",
            status: "Not Started"
        },
        {
            key: 4,
            image: demo,
            name: "Design UI/UX",
            description: "Design fundamentals",
            duration: "2 hours",
            status: "Paused"
        },
        {
            key: 5,
            image: demo,
            name: "Debug Your Code",
            description: "Troubleshooting skills",
            duration: "15 mins",
            status: "Cancelled"
        }
    ];

    return (
        <>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    horizontal
                    contentContainerStyle={{
                        paddingLeft: 4,
                        paddingRight: 16
                    }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <Pressable
                                style={styles.itemContainer}
                                android_ripple={{
                                    color: 'rgba(74, 144, 226, 0.1)',
                                    borderless: false
                                }}
                            >
                                <View style={styles.itemContent}>
                                    <Image
                                        style={styles.image}
                                        resizeMode="cover"
                                        source={demo}
                                    />
                                    <View style={styles.content}>
                                        <Text style={styles.title} numberOfLines={2}>
                                            {item.name}
                                        </Text>
                                        <View>
                                            <Text style={styles.subtitle} numberOfLines={3}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        <Text style={styles.duration}>
                                            {item.duration}
                                        </Text>
                                        <Text style={styles.status}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        )
                    }}
                />
            </View>
        </>
    )
}

export default CollectionLibrary;