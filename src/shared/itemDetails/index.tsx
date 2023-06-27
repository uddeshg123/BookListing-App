import React, { FC } from "react";
import { Text, View } from "react-native";
import styles from "./styles";

type ItemDetailsType = {
    title?: string;
    description ?: string;
    discount?: number;
    price?:number;
};

const ItemDetais: FC<ItemDetailsType> = ({
    title,
    description,
    discount,
    price
}) => {


    return (
        <View>
            <Text style={styles.txtTitle} numberOfLines={1}>{title}</Text>
            {description &&  <Text style={styles.description}>{description}</Text> } 
            <View style={styles.priceContainer}>
                <Text style={styles.txtDiscount}>{discount}{'%'}</Text>
                <Text>{price} {'원'}</Text>
            </View>
        </View>
    );
};

export default ItemDetais;


