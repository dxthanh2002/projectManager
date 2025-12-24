import { APP_COLOR } from "@/utils/constant";
import { useState } from "react";
import { Text, View, StyleSheet, TextInput, KeyboardTypeOptions } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const styles = StyleSheet.create({
    inputGroup: {
        padding: 5,
        gap: 10
    },

    text: {
        fontSize: 18,
    },
    input: {
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },
    eye: {
        position: "absolute",
        right: 10,
        bottom: 35,
    }
})

interface IProps {
    title?: string;
    keyboardType?: KeyboardTypeOptions
    secureTextEntry?: boolean
    value: any
    setValue?: (v: any) => void;
    onChangeText?: any;
    onBlur?: any;
    error?: any;


}
const ShareInput = (props: IProps) => {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [isShowPassword, setShowPassword] = useState<boolean>(false);

    const { title, keyboardType, secureTextEntry = false,
        value, setValue, onChangeText, onBlur, error
    } = props;

    return (

        <View style={styles.inputGroup}>
            <View>
                {title && <Text style={styles.text}>{title}</Text>}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocus(true)}
                    onBlur={(e) => { if (onBlur) onBlur(e); setIsFocus(false); }}
                    keyboardType={keyboardType}
                    style={[styles.input,
                    { borderColor: isFocus ? APP_COLOR.ORANGE : APP_COLOR.GREY }
                    ]}
                    secureTextEntry={secureTextEntry && !isShowPassword}
                />
                {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}
                {secureTextEntry &&
                    <FontAwesome5
                        style={styles.eye}
                        name={isShowPassword ? "eye" : "eye-slash"}
                        size={24}
                        color="black"
                        onPress={() => setShowPassword(!isShowPassword)} />
                }

            </View>

        </View>
    )
}

export default ShareInput;