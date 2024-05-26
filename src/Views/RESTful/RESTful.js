import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from "react-router-dom";

function RESTful() {
    const [songs, setSongs] = useState([]);
    const [newSong, setNewSong] = useState({
        title: '',
        artist: '',
        year: '',
        coverImage: ''
    });
    const [editingSongId, setEditingSongId] = useState(null);
    const [editingSong, setEditingSong] = useState({
        id: null,
        title: '',
        artist: '',
        year: '',
        coverImage: ''
    });
    const [showJSON, setShowJSON] = useState(false);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = () => {
        fetch('https://backend-app-8lstn.ondigitalocean.app/api/songs')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.json();
            })
            .then(data => setSongs(data))
            .catch(error => console.error('Error fetching songs:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingSongId !== null) {
            setEditingSong({ ...editingSong, [name]: value });
        } else {
            setNewSong({ ...newSong, [name]: value });
        }
    };

    const handleAddSong = () => {
        fetch('https://backend-app-8lstn.ondigitalocean.app/api/songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSong)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add song');
                }
                return response.json();
            })
            .then(data => {
                setSongs([...songs, data]);
                setNewSong({
                    title: '',
                    artist: '',
                    year: '',
                    coverImage: ''
                });
            })
            .catch(error => console.error('Error adding song:', error));
    };

    const handleEditSong = () => {
        fetch(`https://backend-app-8lstn.ondigitalocean.app/api/songs/${editingSong.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editingSong)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit song');
                }
                return response.json();
            })
            .then(data => {
                const updatedSongs = songs.map(song => {
                    if (song.id === editingSong.id) {
                        return { ...song, ...editingSong };
                    }
                    return song;
                });
                setSongs(updatedSongs);
                setEditingSongId(null);
                setEditingSong({
                    id: null,
                    title: '',
                    artist: '',
                    year: '',
                    coverImage: ''
                });
            })
            .catch(error => console.error('Error editing song:', error));
    };

    const handleDeleteSong = (id) => {
        fetch(`https://backend-app-8lstn.ondigitalocean.app/api/songs/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete song');
                }
                return response.json();
            })
            .then(() => {
                const updatedSongs = songs.filter(song => song.id !== id);
                setSongs(updatedSongs);
            })
            .catch(error => console.error('Error deleting song:', error));
    };

    const handleStartEditing = (song) => {
        setEditingSongId(song.id);
        setEditingSong(song);
    };

    const toggleJSON = () => {
        setShowJSON(!showJSON);
    };

    return (
        <div>
            <h1>Canciones</h1>
            <h2>Agregar Nueva Canción</h2>
            <input type="text" name="title" placeholder="Título" value={newSong.title} onChange={handleInputChange} />
            <input type="text" name="artist" placeholder="Artista" value={newSong.artist} onChange={handleInputChange} />
            <input type="text" name="year" placeholder="Año" value={newSong.year} onChange={handleInputChange} />
            <input type="text" name="coverImage" placeholder="URL de la imagen de portada" value={newSong.coverImage} onChange={handleInputChange} />
            <button onClick={handleAddSong}>Agregar Canción</button>

            <h2>Canciones Existentes</h2>
            {songs.length > 0 ? (
                <ul>
                    {songs.map(song => (
                        <li key={song.id}>
                            {editingSongId === song.id ? (
                                <div>
                                    <h3>{song.title}</h3>
                                    <input type="text" name="title" value={editingSong.title} onChange={handleInputChange} />
                                    <input type="text" name="artist" value={editingSong.artist} onChange={handleInputChange} />
                                    <input type="text" name="year" value={editingSong.year} onChange={handleInputChange} />
                                    <input type="text" name="coverImage" value={editingSong.coverImage} onChange={handleInputChange} />
                                    <button onClick={handleEditSong}>Guardar Cambios</button>
                                </div>
                            ) : (
                                <div>
                                    <h3>{song.title}</h3>
                                    <p><strong>Artista:</strong> {song.artist}</p>
                                    <p><strong>Año:</strong> {song.year}</p>
                                    <img src={song.coverImage} alt={song.title} style={{ maxWidth: '200px' }} />
                                    <button className="delete" onClick={() => handleDeleteSong(song.id)}>Eliminar</button>
                                    <button className="edit" onClick={() => handleStartEditing(song)}>Editar</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                    <p>No hay canciones disponibles.</p>
                )}

            {/* Botón para mostrar/ocultar el formato JSON */}
            <button onClick={toggleJSON} className="styled-button">{showJSON ? "Ocultar JSON" : "Mostrar JSON"}</button>
            {/* Mostrar el formato JSON si showJSON es verdadero */}
            {showJSON && <pre>{JSON.stringify(songs, null, 2)}</pre>}

            <div className="button-container">
                <Link to="/"><button className="styled-button">Inicio</button></Link>
            </div>
        </div>
    );
}

export default RESTful;
