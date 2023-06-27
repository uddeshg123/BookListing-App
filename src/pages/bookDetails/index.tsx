import React, { FC, useCallback, useEffect } from 'react'
import { Image, SafeAreaView } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootNavigationProp } from '../../navigation/stack';
import { Header, ItemDetais } from '../../shared';
import { BooksSelectors, getBookDetails } from '../../reducers/books';
import { useAppDispatch } from '../../hooks';
import { RootStackParamList } from '../../types';

type BookDetailsType = Record<never, string>;
type OtpScreenRoute = RouteProp<RootStackParamList, "BookDetails">;

const BookDetails: FC<
    BookDetailsType
> = ({ }: BookDetailsType) => {
    const route = useRoute<OtpScreenRoute>();
    const dispath = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const { bookDetails } = BooksSelectors() || {};
    const { book_id } = route?.params || {};

    /** _handle Book Details */
    const _handleBookDetails = useCallback(() => {
        dispath(getBookDetails({ id: book_id }))
    }, [dispath, getBookDetails]);


    /** call _handleBookDetails */
    useEffect(() => {
        _handleBookDetails();
    }, []);

    return (
        <SafeAreaView>
            <Header navigation={navigation} isBack title={bookDetails?.title} />
            <Image source={{ uri: bookDetails?.image }} style={{ width: '100%', height: 500 }} />
            <ItemDetais title={bookDetails?.title} description={bookDetails?.description} discount={bookDetails?.discount} price={bookDetails?.price} />
        </SafeAreaView>
    )
}

export default BookDetails;

