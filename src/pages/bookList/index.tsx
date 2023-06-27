import React, { FC, useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Pressable, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../navigation/stack';
import { BookListProps } from '../../types';
import { Header, ItemDetais } from '../../shared';
import { useAppDispatch } from '../../hooks';
import { BooksSelectors, getBookList } from '../../reducers/books';
import { PAGE_SIZE } from '../../utils/constant';
import styles from './styles';

type BookListType = Record<never, string>;

type ListItemCard = {
    item?: BookListProps | null
};

const BookList: FC<
    BookListType
> = ({ }: BookListType) => {
    const dispath = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const { isBookListpaginating, isBookListFinished, loading } = BooksSelectors() || {};
    const [page, setPage] = useState<number>(1);
    const [bookData, setBookData] = useState<any>([]);

    /** _handle Book List */
    const _handleBookList = useCallback((pageNumber = 1) => {
        dispath(getBookList({ limit: PAGE_SIZE, page: pageNumber}))
            .then(res => {
                 const data = [...bookData, ...res?.payload?.books];
                 setBookData(data);
            })
            .catch(err => {
            });
    },[dispath, getBookList, bookData, setBookData]);

    useEffect(() => {
        _handleBookList();
    }, []);

    /** handle navigation */
    const _navigateTo = (item: any) => {
        navigation?.navigate('BookDetails', {
            book_id: item?._id
        });
    };
    
    /** handle loadMoreData*/
    const loadMoreData = useCallback(() => {        
        if (!isBookListpaginating && !isBookListFinished) {
            const nextPage = page + 1;
            setPage(nextPage);
            _handleBookList(nextPage);            
        }
    }, [isBookListpaginating, isBookListFinished, page, setPage, _handleBookList]);

    /** handle list item card */
    const ListItemCard = ({ item }: ListItemCard) => {
        return (
            <Pressable onPress={() => _navigateTo(item)} style={styles.listItemContainer}>
                <Image source={{ uri: item?.image }} style={styles.coverImage} resizeMode="stretch" />
                <ItemDetais title={item?.title}   discount={item?.discount} price={item?.price}   />
            </Pressable>
        );
    };

    return (
        <SafeAreaView>
            <Header title={'자유톡'} style={styles.header} />
            <FlatList
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                contentContainerStyle={styles.contentContainer}
                data={bookData || []}
                //   keyExtractor={(item) => item?._id}
                ListFooterComponent={() => {
                    return (
                        <>{loading && <ActivityIndicator animating={loading} size={'large'} />}</>
                    )
                }}
                renderItem={ListItemCard}
                onEndReachedThreshold={0.1}
                onEndReached={loadMoreData}
            />
        </SafeAreaView>
    )
}

export default BookList;

