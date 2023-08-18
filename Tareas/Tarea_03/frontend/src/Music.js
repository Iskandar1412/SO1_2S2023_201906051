import React, { useState } from 'react';

const Music = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: 0,
    genre: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    //console.log(formData)
    try {
      const response = await fetch('http://localhost:8000/reg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Song data saved successfully');
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
        }, 3000);
      } else {
        console.error('Error saving song data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newValue = name === 'year' ? Number(value): value
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const [jsonData, setJsonData] = useState(null);

  const handleFetchData = async () => {
    try {
        const response = await fetch('http://localhost:8000/music');
        const data = await response.json();
        setJsonData(data);
    } catch (error) {
        console.error('Error encontrando datos:', error)
    }
  }

  return (
    <div className='song-form-container'>
        <div className='song-form'>
        <h2>Ingrese canción</h2>
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
            </div>

            <div className='form-group'>
                <label>Artist:</label>
                <input type="text" name="artist" value={formData.artist} onChange={handleInputChange} />
            </div>

            <div className='form-group'>
                <label>Year:</label>
                <input type="number" name="year" value={formData.year !== 0 ? formData.year : ''} onChange={handleInputChange} />
            </div>

            <div className='form-group'>
                <label>Genre:</label>
                <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} />
            </div>

            <button type="submit">Save</button>
        </form>
        {isSuccess && <p className='success-message'>¡Datos enviados Correctamente!</p>}
        </div>

        <div className='json-section'>
            <h2>Json</h2>
            <button onClick={handleFetchData}>Fetch Data</button>
            <div className='json-content'>
                {
                    jsonData && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Artist</th>
                                    <th>Year</th>
                                    <th>Genre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jsonData.map((song, index) => (
                                    <tr key={index}>
                                        <td>{song.title}</td>
                                        <td>{song.artist}</td>
                                        <td>{song.year}</td>
                                        <td>{song.genre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }
            </div>
        </div>
    </div>
  );
};

export default Music;