import LoadingOverlay from "@/components/loading/overlay";
import { resendCodeAPI, verifyCodeAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native"
import OTPTextView from 'react-native-otp-textinput';
import Toast from "react-native-root-toast";
const styles = StyleSheet.create({
    container: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 25,
        fontWeight: "600",
        marginVertical: 20
    }
})
//xử lý sự kiện onChange để gọi API, chưa sử dụng ref


const VerifyPage = () => {
    const [isSummit, setIsSummit] = useState<boolean>(false);
    const [otpCode, setOtpCode] = useState<string>("");
    const otpRef = useRef<OTPTextView>(null);
    const { email, isLogin } = useLocalSearchParams();


    // Thực hiện Xác thực Verify
    const verifyCode = async () => {
        setIsSummit(true);
        Keyboard.dismiss();
        const res = await verifyCodeAPI(email as string, otpCode)
        if (res.data) {//nếu thành công
            //thông báo Toast
            otpRef?.current?.clear();
            Toast.show("Kích hoạt tài khoản thành công", {
                duration: Toast.durations.LONG,
                textColor: "white",
                backgroundColor: APP_COLOR.ORANGE,
                opacity: 1
            });
            // Điều hướng
            if (isLogin) {
                router.replace("/(tabs)");
            } else {
                router.replace("/(auth)/login")
            }

        } else {
            Toast.show(res.message as string), {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                opacity: 1

            };
        }
    }
    useEffect(() => {
        if (otpCode && otpCode.length == 6) {
            verifyCode();
        }

    }, [otpCode])
    const handleResendCode = async () => {
        otpRef?.current?.clear();
        //call API
        const res = await resendCodeAPI(email as string)
        if (res.data) {
            const m = res.data ? "Resend thành công" : res.message;
            Toast.show(m as string, {
                duration: Toast.durations.LONG,
                textColor: "white",
                backgroundColor: APP_COLOR.ORANGE,
                opacity: 1
            });
        }
    }


    return (
        <>
            <View style={styles.container}>
                <Text style={styles.heading}> Xác thực tài khoản</Text>
                <Text style={{ marginVertical: 10 }}>Vui lòng nhập mã xác nhận đã được gửi tới địa chỉ hoidanit@gmail.com</Text>
                <View style={{ marginVertical: 20 }}>
                    <OTPTextView
                        handleTextChange={setOtpCode}
                        ref={otpRef}
                        autoFocus
                        inputCount={6}
                        inputCellLength={1}
                        tintColor={APP_COLOR.ORANGE}
                        textInputStyle={{
                            borderWidth: 1,
                            borderColor: APP_COLOR.GREY,
                            borderBottomWidth: 1,
                            borderRadius: 5,
                            // @ts-ignore:next-line
                            color: APP_COLOR.ORANGE
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Text >Không nhận được mã xác nhận,</Text>
                    <Text onPress={handleResendCode} style={{ textDecorationLine: 'underline' }}> gửi lại</Text>
                </View>
            </View>
            {isSummit && <LoadingOverlay />}
        </>

    )
}

export default VerifyPage;