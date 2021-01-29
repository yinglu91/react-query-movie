import React, {useState} from 'react';
import { useInfiniteQuery } from 'react-query'
import {
  API_URL, API_KEY,
  POSTER_SIZE, BACKDROP_SIZE, IMAGE_BASE_URL
} from '../config';
import HeroImage from './HeroImage';
import Grid from './Grid';
import Thumb from './Thumb';
import Spinner from './Spinner';
import SearchBar from './SearchBar';
import Button from './Button';
import NoImage from '../images/no_image.jpg';

const SEARCH_BASE_URL = `${API_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=`;
const POPULAR_BASE_URL = `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US`;

const fetchMovies = async (searchTerm, page) => {
  const moviesEndpoint = searchTerm
    ? `${SEARCH_BASE_URL}${searchTerm}&page=${page}`
    : `${POPULAR_BASE_URL}&page=${page}`;
  
  return await (await fetch(moviesEndpoint)).json();
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isFetching, fetchNextPage, isError, hasNextPage } = useInfiniteQuery(
    `movies-${searchTerm}`,
    (_key, page) => fetchMovies(searchTerm, page),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page === lastPage.total_page) { // in the last page
          return undefined
        }

        return lastPage.page + 1   // next page number
      }
    }
  )
  // console.log(data)

  if (isError) return <div>Something went wrong ...</div>;

  return (
    <>
      {!searchTerm && !isFetching && (
        <HeroImage
          image={`${IMAGE_BASE_URL}/${BACKDROP_SIZE}${data.pages[0].results[0].backdrop_path}`}
          title={data.pages[0].results[0].original_title}
          text={data.pages[0].results[0].overview}
        />
      )}

      <SearchBar setSearchTerm={setSearchTerm} />

      <Grid header={searchTerm ? 'Search Result' : 'Popular Movies'}>
        {data && data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.results.map((movie) => (
              <Thumb
                key={movie.id}
                clickable
                image={
                  movie.poster_path
                    ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
                    : NoImage
                }
                movieId={movie.id}
              />
            ))}
          </React.Fragment>
        ))}
      </Grid>

      {isFetching && <Spinner />}

      {hasNextPage && !isFetching && (
        <Button text='Load More' callback={() => fetchNextPage()} />
      )}
    </>
  );
};

export default Home;
