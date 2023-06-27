export type RootStackParamList = {
    BookList: undefined;
    BookDetails: {
        book_id: number;
    };
  };

export type BookListProps = {
  _id: string;
  title: string;
  discount: number;
  price: number;
  description: string;
  status: number;
  author_name: string;
  created_date: string;
  book_id: number;
  image: string;
  __v: number;
};
