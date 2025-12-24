import HeaderHome from "@/components/home/header.home";
import { useCurrentApp } from "@/context/app.context";
import { currencyFormatter, getURLBaseBackend, placeOrderAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-root-toast";

interface IOrderItem {
    image: string;
    title: string;
    option: string;
    price: number;
    quantity: number;
}

const PlaceOrderPage = () => {
    const { restaurant, cart, setCart } = useCurrentApp();
    const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);

    // Build orderItems từ cart và restaurant
    useEffect(() => {
        if (
            cart &&
            restaurant &&
            restaurant._id &&
            cart[restaurant._id]?.items
        ) {
            const result: IOrderItem[] = [];

            for (const [, currentItems] of Object.entries(
                cart[restaurant._id].items
            )) {
                if (currentItems.extra) {
                    for (const [key, value] of Object.entries(
                        currentItems.extra
                    )) {
                        const option = currentItems.data.options?.find(
                            (item) =>
                                `${item.title}-${item.description}` === key
                        );

                        const addPrice = option?.additionalPrice ?? 0;

                        result.push({
                            image: currentItems.data.image,
                            title: currentItems.data.title,
                            option: key,
                            price:
                                currentItems.data.basePrice +
                                addPrice,
                            quantity: value,
                        });
                    }
                } else {
                    result.push({
                        image: currentItems.data.image,
                        title: currentItems.data.title,
                        option: "",
                        price: currentItems.data.basePrice,
                        quantity: currentItems.quantity,
                    });
                }
            }

            setOrderItems(result);
        } else {
            // clear khi cart rỗng hoặc không có dữ liệu
            setOrderItems([]);
        }
    }, [restaurant, cart]);

    const handlePlaceOrder = async () => {
        const cartData = cart?.[restaurant!._id];

        if (!restaurant || !cartData) return;

        const data = {
            restaurant: restaurant._id,
            totalPrice: cartData.sum,
            totalQuantity: cartData.quantity,
            detail: orderItems,
        };

        const res = await placeOrderAPI(data);

        if (res.data) {
            Toast.show("Đặt hàng thành công", {
                duration: Toast.durations.LONG,
                textColor: "white",
                backgroundColor: APP_COLOR.ORANGE,
                opacity: 1,
            });

            // clear giỏ hàng cho nhà hàng này
            setCart((prevCart: any) => {
                const updated = { ...prevCart };
                delete updated[restaurant._id];
                return updated;
            });

            router.navigate("/");
        } else {
            const m = Array.isArray(res.message)
                ? res.message[0]
                : res.message;

            Toast.show(m, {
                duration: Toast.durations.LONG,
                textColor: "white",
                backgroundColor: APP_COLOR.ORANGE,
                opacity: 1,
            });
        }
    };

    const cartData = restaurant ? cart?.[restaurant._id] : null;

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View
                style={{
                    borderBottomColor: "#eee",
                    borderBottomWidth: 1,
                    padding: 10,
                }}
            >
                <HeaderHome />
            </View>

            {/* Restaurant name */}
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: "600" }}>
                    {restaurant?.name}
                </Text>
            </View>

            {/* Order list */}
            <ScrollView style={{ flex: 1, padding: 10 }}>
                {orderItems.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            gap: 10,
                            flexDirection: "row",
                            borderBottomColor: "#eee",
                            borderBottomWidth: 1,
                            paddingVertical: 10,
                        }}
                    >
                        <Image
                            style={{ height: 50, width: 50 }}
                            source={{
                                uri: `${getURLBaseBackend()}/images/menu-item/${item?.image}`,
                            }}
                        />
                        <View>
                            <Text style={{ fontWeight: "600" }}>
                                {item.quantity} x
                            </Text>
                        </View>
                        <View style={{ gap: 10 }}>
                            <Text>{item.title}</Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: APP_COLOR.GREY,
                                }}
                            >
                                {item.option}
                            </Text>
                        </View>
                    </View>
                ))}

                {orderItems.length > 0 && cartData && (
                    <View style={{ marginVertical: 15 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{ color: APP_COLOR.GREY }}>
                                Tổng cộng ({cartData.quantity} món)
                            </Text>
                            <Text>
                                {currencyFormatter(cartData.sum)}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Payment & Place order */}
            {cartData && (
                <View
                    style={{
                        gap: 20,
                        marginBottom: 15,
                        padding: 10,
                    }}
                >
                    {/* Payment options */}
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                        }}
                    >
                        <Pressable
                            style={{
                                borderWidth: 1,
                                borderColor: APP_COLOR.GREY,
                                flex: 1,
                                padding: 7,
                            }}
                        >
                            <Text
                                style={{
                                    color: APP_COLOR.GREY,
                                    textAlign: "center",
                                }}
                            >
                                Ví PayPal
                            </Text>
                        </Pressable>
                        <Pressable
                            style={{
                                borderWidth: 1,
                                borderColor: APP_COLOR.ORANGE,
                                flex: 1,
                                padding: 7,
                            }}
                        >
                            <Text
                                style={{
                                    color: APP_COLOR.ORANGE,
                                    textAlign: "center",
                                }}
                            >
                                Tiền mặt
                            </Text>
                        </Pressable>
                    </View>

                    {/* Place order button */}
                    <View>
                        <Pressable
                            onPress={handlePlaceOrder}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                                padding: 10,
                                backgroundColor: APP_COLOR.ORANGE,
                                borderRadius: 3,
                            })}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    textAlign: "center",
                                }}
                            >
                                Đặt đơn -{" "}
                                {currencyFormatter(cartData.sum)}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
};

export default PlaceOrderPage;
