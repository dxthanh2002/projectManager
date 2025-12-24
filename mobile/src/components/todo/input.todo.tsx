import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import MineButton from '../button/mine.button';

const styles = StyleSheet.create({
    todoInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    }
})
interface Iprops {
    addTodo: (value: string) => void;

}


const InputTodo = (prop: Iprops) => {
    // const
    const { addTodo } = prop;
    const [name, setName] = useState<string>("");
    const handleAddNewTodo = () => {
        if (name == "") {
            Alert.alert("Nhập thiếu chữ",
                "Hãy nhập lại",
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK Baby',
                        onPress: () => console.log('OK Pressed')
                    },
                ]);
            return;
        }

        addTodo(name);
        setName("");
    }
    //
    return (
        <>
            <View style={{ marginBottom: 20 }}>
                <TextInput
                    autoCapitalize='words'
                    onChangeText={value => setName(value)}
                    value={name}
                    style={styles.todoInput}
                />
                <Button title='Add New' onPress={handleAddNewTodo} />
            </View>
            <MineButton title="ADD NEW" onPress={handleAddNewTodo} />
        </>
    )
}

export default InputTodo;