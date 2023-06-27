

import { StyleSheet } from "react-native";
import { Colors } from "../../theme/colors";

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10,
        marginBottom: 10
    },
    txtTitle: {
        fontSize: 20,  
        textAlign: 'center',  
        color: Colors.HEADING, 
        fontWeight: '500',
    }
})


export default styles;