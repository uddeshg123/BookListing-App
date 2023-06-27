import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import * as booksApi from "../../services/books";
import { BookListProps } from "../../types";

export interface BooksState {
    loading: boolean;
    bookList: BookListProps | null;
    isBookListpaginating: boolean;
    isBookListFinished: boolean;
    bookRecordCount: number;
    bookDetails: BookListProps | null;
}
const initialState: BooksState = {
    loading: false,
    bookList: null,
    isBookListpaginating: false,
    isBookListFinished: false,
    bookRecordCount: 0,
    bookDetails: null
};

export const getBookList = createAsyncThunk(
    "book/list",
    async (
        options: { limit: number, page: number },
        { rejectWithValue }
    ) => {
        try {
            return await booksApi.bookList(options?.limit, options?.page);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);


export const getBookDetails = createAsyncThunk(
    "book/details",
    async (
        options: { id: number },
        { rejectWithValue }
    ) => {
        try {
            return await booksApi.bookDetails(options?.id);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const bookSlice = createSlice({
    name: "books",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getBookList.pending, (state, action) => {
            const bookListPaginating = action?.meta?.arg?.page > 0;
            state.isBookListpaginating = bookListPaginating;
            state.loading = true;
        });
        builder.addCase(getBookList.fulfilled, (state, action) => {
            const data = action?.payload || [];
            if (data?.books?.length === 0) {
                state.isBookListFinished = true;
            } else {
                state.isBookListFinished = false;
                state.bookList = data?.books;
            }
            state.bookRecordCount = data?.count;
            state.isBookListpaginating = false;
            state.loading = false;
        });
        builder.addCase(getBookList.rejected, (state) => {
            state.loading = false;
            state.bookList = null;
            state.isBookListpaginating = false;
        });
        builder.addCase(getBookDetails.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getBookDetails.fulfilled, (state, action) => {
            const data = action?.payload || [];
            state.bookDetails = data?.book;
            state.loading = false;
        });
        builder.addCase(getBookDetails.rejected, (state) => {
            state.loading = false;
            state.bookDetails = null;
        });
    },
});

export default bookSlice.reducer;

interface BooksSelectorsType {
    loading: boolean;
    bookList: BookListProps | null;
    isBookListpaginating: boolean;
    isBookListFinished: boolean;
    bookRecordCount: number;
    bookDetails: BookListProps | null
}

export const BooksSelectors = (): BooksSelectorsType => {
    const loading = useSelector((state: RootState) => state?.books?.loading);
    const bookList = useSelector((state: RootState) => state?.books?.bookList);
    const isBookListpaginating = useSelector((state: RootState) => state?.books?.isBookListpaginating);
    const isBookListFinished = useSelector((state: RootState) => state?.books?.isBookListFinished);
    const bookRecordCount = useSelector((state: RootState) => state?.books?.bookRecordCount);
    const bookDetails = useSelector((state: RootState) => state?.books?.bookDetails);

    return {
        loading,
        bookList,
        isBookListpaginating,
        isBookListFinished,
        bookRecordCount,
        bookDetails
    };
};
