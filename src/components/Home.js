import React, {useState} from 'react';
import API from '../API';
import { useInfiniteQuery } from 'react-query'
import { POSTER_SIZE, BACKDROP_SIZE, IMAGE_BASE_URL } from '../config';
import HeroImage from './HeroImage';
import Grid from './Grid';
import Thumb from './Thumb';
import Spinner from './Spinner';
import SearchBar from './SearchBar';
import Button from './Button';
import NoImage from '../images/no_image.jpg';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isFetching, fetchNextPage, isError, hasNextPage } = useInfiniteQuery(
    `moview-${searchTerm}`,
    (_key, page) => API.fetchMovies(searchTerm, page),
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
      {!searchTerm && !isFetching ? (
        <HeroImage
          image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${data.pages[0].results[0].backdrop_path}`}
          title={data.pages[0].results[0].original_title}
          text={data.pages[0].results[0].overview}
        />
      ) : null}

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
                    ? IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path
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

/*
data:
{
   "page": 1,
   "results": [
      {
         "adult": false,
         "backdrop_path": "/3ombg55JQiIpoPnXYb2oYdr6DtP.jpg",
         "genre_ids": [
            878,
            28
         ],
         "id": 560144,
         "original_language": "en",
         "original_title": "Skylines",
         "overview": "When a virus threatens to turn the now earth-dwelling friendly alien hybrids against humans, Captain Rose Corley must lead a team of elite mercenaries on a mission to the alien world in order to save what's left of humanity.",
         "popularity": 3957.023,
         "poster_path": "/2W4ZvACURDyhiNnSIaFPHfNbny3.jpg",
         "release_date": "2020-10-25",
         "title": "Skylines",
         "video": false,
         "vote_average": 5.9,
         "vote_count": 120
      },
      {
         "adult": false,
         "backdrop_path": "/lOSdUkGQmbAl5JQ3QoHqBZUbZhC.jpg",
         "genre_ids": [
            53,
            28,
            878
   
    */
