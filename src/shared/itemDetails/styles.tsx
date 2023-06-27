

import { StyleSheet } from "react-native";
import { Colors } from "../../theme/colors";

const styles = StyleSheet.create({
    txtTitle: { 
        paddingHorizontal: 12,
        marginTop: 10,
        width: '70%',
        fontWeight:'700',
        color: Colors.BLACK,
    },
    priceContainer: { 
        paddingHorizontal: 12, 
        marginTop: 15,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom:15
    },
    txtDiscount: { 
        color: Colors.RED, 
        fontWeight: '500'
    },
    description : {
        marginTop: 12,
        marginHorizontal: 12,
        marginBottom: 12,
        color: Colors.BLACK

    }
})


export default styles;