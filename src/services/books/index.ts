import { _baseRequest } from "..";
import { COMMON } from "../../common";
import { end_point } from "../../utils/apiEndpoints";

export const bookList = async (limit: number, page: number) => {        
    return _baseRequest(COMMON.stringFormat(
        end_point.book_list,
        limit,
        page
    ), "GET").then((res) => {                        
        return res;
    });
};

export const bookDetails = async (id: number) => {            
    return _baseRequest(COMMON.stringFormat(
        end_point.book_details,
        id
    ), "GET").then((res) => {                        
        return res;
    });
};
