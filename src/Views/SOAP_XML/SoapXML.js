import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SoapXML() {
    const [songs, setSongs] = useState([]);
    const [songsXML, setSongsXML] = useState('');
    const [showXML, setShowXML] = useState(false);
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

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = () => {
        fetch('https://backend-app-8lstn.ondigitalocean.app/xml/songs')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.text();
            })
            .then(str => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(str, "application/xml");
                const songsArray = Array.from(xmlDoc.getElementsByTagName("song")).map(song => ({
                    id: song.getElementsByTagName("id")[0].textContent,
                    title: song.getElementsByTagName("title")[0].textContent,
                    artist: song.getElementsByTagName("artist")[0].textContent,
                    year: song.getElementsByTagName("year")[0].textContent,
                    coverImage: song.getElementsByTagName("coverImage")[0].textContent,
                }));
                setSongs(songsArray);
                setSongsXML(str);
            })
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
        const songXml = `
            <song>
                <title>${newSong.title}</title>
                <artist>${newSong.artist}</artist>
                <year>${newSong.year}</year>
                <coverImage>${newSong.coverImage}</coverImage>
            </song>
        `;
        fetch('https://backend-app-8lstn.ondigitalocean.app/xml/songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml'
            },
            body: songXml
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add song');
                }
                return response.text();
            })
            .then(() => {
                fetchSongs();
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
        const songXml = `
            <song>
                <id>${editingSong.id}</id>
                <title>${editingSong.title}</title>
                <artist>${editingSong.artist}</artist>
                <year>${editingSong.year}</year>
                <coverImage>${editingSong.coverImage}</coverImage>
            </song>
        `;
        fetch(`https://backend-app-8lstn.ondigitalocean.app/xml/songs/${editingSong.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/xml'
            },
            body: songXml
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit song');
                }
                return response.text();
            })
            .then(() => {
                fetchSongs();
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
        fetch(`https://backend-app-8lstn.ondigitalocean.app/xml/songs/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete song');
                }
                return response.text();
            })
            .then(() => {
                fetchSongs();
            })
            .catch(error => console.error('Error deleting song:', error));
    };

    const handleStartEditing = (song) => {
        setEditingSongId(song.id);
        setEditingSong(song);
    };

    const toggleShowXML = () => {
        setShowXML(!showXML);
    };

    return (
        <div>
            <h1>Canciones</h1>
            {showXML && <pre>{songsXML}</pre>}
            <h2>Agregar Nueva canción</h2>
            <input type="text" name="title" placeholder="Título" value={newSong.title} onChange={handleInputChange} />
            <input type="text" name="artist" placeholder="Artista" value={newSong.artist} onChange={handleInputChange} />
            <input type="text" name="year" placeholder="Año" value={newSong.year} onChange={handleInputChange} />
            <input type="text" name="coverImage" placeholder="URL de la imagen de portada" value={newSong.coverImage} onChange={handleInputChange} />
            <button onClick={handleAddSong}>Agregar canción</button>

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
            <div className="button-container">
                <button onClick={toggleShowXML} className="styled-button">
                    {showXML ? 'Ocultar XML' : 'Mostrar XML'}
                </button>
                <Link to="/">
                    <button className="styled-button">Inicio</button>
                </Link>
            </div>
        </div>
    );
}

export default SoapXML;
