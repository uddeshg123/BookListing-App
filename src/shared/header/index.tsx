import React, { FC } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Colors } from "../../theme/colors";
import styles from "./styles";

type HeaderType = {
    title?: string;
    navigation?: NavigationProp<ParamListBase>,
    isBack?: boolean;
    style?: ViewStyle;
};

const Header: FC<HeaderType> = ({
    title,
    navigation,
    isBack,
    style
}) => {

    /** handle go back function */
    const _goBack = () => {
         navigation?.goBack();
    };

    return (
        <View style={[styles.container, style]}>
           {isBack &&
            <Pressable onPress={_goBack}>
                <Text style={styles.txtTitle}>{'←'}</Text>
            </Pressable>
            }
            <Text style={styles.txtTitle}>{title}</Text>
            <View />
        </View>
    );
};

export default Header;


