import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from "react-router-dom";

// Consulta GraphQL para obtener todas las canciones
const GET_SONGS = gql`
  query {
    songs {
      id
      title
      artist
      year
      coverImage
    }
  }
`;

// Mutación GraphQL para agregar una cancion
const ADD_SONG = gql`
  mutation AddSong($title: String!, $artist: String!, $year: Int!, $coverImage: String) {
    addSong(title: $title, artist: $artist, year: $year, coverImage: $coverImage) {
      id
      title
      artist
      year
      coverImage
    }
  }
`;

// Mutación GraphQL para actualizar una cancion
const UPDATE_SONG = gql`
  mutation UpdateSong($id: ID!, $title: String!, $artist: String!, $year: Int!, $coverImage: String) {
    updateSong(id: $id, title: $title, artist: $artist, year: $year, coverImage: $coverImage) {
      id
      title
      artist
      year
      coverImage
    }
  }
`;

// Mutación GraphQL para eliminar una cancion
const DELETE_SONG = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id) {
      id
    }
  }
`;

function GraphQL() {
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        artist: '',
        year: '',
        coverImage: ''
    });

    const { loading, error, data } = useQuery(GET_SONGS);
    const [addSong] = useMutation(ADD_SONG, {
        update(cache, { data: { addSong } }) {
            const { songs } = cache.readQuery({ query: GET_SONGS });
            cache.writeQuery({
                query: GET_SONGS,
                data: { songs: [...songs, addSong] },
            });
        }
    });

    const [updateSong] = useMutation(UPDATE_SONG, {
        update(cache, { data: { updateSong } }) {
            const { songs } = cache.readQuery({ query: GET_SONGS });
            cache.writeQuery({
                query: GET_SONGS,
                data: { songs: songs.map(song => song.id === updateSong.id ? updateSong : song) },
            });
        }
    });

    const [deleteSong] = useMutation(DELETE_SONG, {
        update(cache, { data: { deleteSong } }) {
            const { songs } = cache.readQuery({ query: GET_SONGS });
            cache.writeQuery({
                query: GET_SONGS,
                data: { songs: songs.filter(song => song.id !== deleteSong.id) },
            });
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveSong = async () => {
        try {
            if (formData.id) {
                await updateSong({ variables: { ...formData, year: parseInt(formData.year) } });
            } else {
                await addSong({ variables: { ...formData, year: parseInt(formData.year) } });
            }
            setFormData({
                id: null,
                title: '',
                artist: '',
                year: '',
                coverImage: ''
            });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDeleteSong = async (id) => {
        try {
            await deleteSong({ variables: { id } });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleStartEditing = (song) => {
        setFormData({ ...song, year: song.year.toString() });
    };

    const [showJSON, setShowJSON] = useState(false);

    const toggleJSON = () => {
        setShowJSON(!showJSON);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <h1>Canciones</h1>
            <h2>Agregar/Editar Canción</h2>
            <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleInputChange} />
            <input type="text" name="artist" placeholder="Artista" value={formData.artist} onChange={handleInputChange} />
            <input type="text" name="year" placeholder="Año" value={formData.year} onChange={handleInputChange} />
            <input type="text" name="coverImage" placeholder="URL de la imagen de portada" value={formData.coverImage} onChange={handleInputChange} />
            <button onClick={handleSaveSong}>Guardar</button>

            <h2>Canciones Existentes</h2>
            <ul>
                {data.songs.map(song => (
                    <li key={song.id}>
                        <h3>{song.title}</h3>
                        <p><strong>Artista:</strong> {song.artist}</p>
                        <p><strong>Año:</strong> {song.year}</p>
                        <img src={song.coverImage} alt={song.title} style={{ maxWidth: '200px' }} />
                        <button className="edit" onClick={() => handleStartEditing(song)}>Editar</button>
                        <button className="delete" onClick={() => handleDeleteSong(song.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            
            {/* Botón para mostrar/ocultar el formato JSON */}
            <button onClick={toggleJSON} className="styled-button">{showJSON ? "Ocultar JSON" : "Mostrar JSON"}</button>
            {/* Mostrar el formato JSON si showJSON es verdadero */}
            {showJSON && <pre>{JSON.stringify(data, null, 2)}</pre>}

            <div className="button-container">
                <Link to="/">
                    <button className="styled-button">Inicio</button>
                </Link>
            </div>
        </div>
    );
}

export default GraphQL;
