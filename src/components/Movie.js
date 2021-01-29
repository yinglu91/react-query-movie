import React from 'react'
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query'
import {
  API_URL, API_KEY,
  POSTER_SIZE, IMAGE_BASE_URL
} from '../config';
import BreadCrumb from './BreadCrumb';
import Grid from './Grid';
import Spinner from './Spinner';
import MovieInfo from './MovieInfo';
import MovieInfoBar from './MovieInfoBar';
import Actor from './Actor';
import NoImage from '../images/no_image.jpg';

const fetchMovie = async (movieId) => {
  const movieUrl = `${API_URL}/movie/${movieId}?api_key=${API_KEY}`;
  const movie = await (await fetch(movieUrl)).json();

  const creditsUrl = `${API_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
  const credits = await (await fetch(creditsUrl)).json();

  const directors = credits.crew.filter(
    member => member.job === 'Director'
  );

  return {
    ...movie,
    actors: credits.cast,
    directors
  }
}

const Movie = () => {
  const { movieId } = useParams();
  const { data: movie, isLoading, isError } = useQuery(movieId, () => fetchMovie(movieId))
  // console.log(movie)

  if (isLoading) return <Spinner />;
  if (isError) return <div>Something went wrong...</div>;

  return (
    <>
      <BreadCrumb movieTitle={movie.original_title} />
      <MovieInfo movie={movie} /> 

      <MovieInfoBar
        time={movie.runtime}
        budget={movie.budget}
        revenue={movie.revenue}
      />

      <Grid header='Actors'>
        {movie.actors.map(actor => (
          <Actor
            key={actor.credit_id}
            name={actor.name}
            character={actor.character}
            imageUrl={
              actor.profile_path
                ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${actor.profile_path}`
                : NoImage
            }
          />
        ))}
      </Grid>
    </>
  );
};

export default Movie;
