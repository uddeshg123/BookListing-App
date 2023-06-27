import { Platform } from "react-native";
import { base_url } from "./services";

export const COMMON = {
     isIos() {
        return Platform.OS === 'ios';
    },
    get apiBaseUrl() {
        return base_url.live;
    },

    get apiLocalUrl() {
        return base_url.dev;
    },

    stringFormat(s: string, ...args: (number | string | boolean)[]) {
        return s.replace(/{([0-9]+)}/g, (match, index) =>
            (typeof args[index] === 'undefined' ? match : args[index]).toString(),
        );
    },
    convertor(value: string) {
        return value?.replace('+', '%2B');
    },
};