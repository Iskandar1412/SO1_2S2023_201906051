import React, { useState } from 'react';
//import React from 'react';
import axios from 'axios';
import PieChartCPU from '../graphs/PieChartCPU'


function RealTime() {
    const charDataCPU = {
        labels: ['C', 'D'],
        datasets: [
            {
                label: 'Grafica CPU',
                data: [150, 30],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    //console.log("CHart data:" , charDataCPU);
    
    const [contentPost, setcontentPost] = useState([]);
    const handleText = (e) => {
        setcontentPost(e.target.value);
    };

    const handlePost = async () => {
        const valor = contentPost;
        try {
            const response = await axios.post('http://localhost:3000/node-go/post-go', { value: valor}, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = response.data;
            console.log(data)
        } catch (err) { console.log('Error en la solicitud al backend (NodeJS):', err) }
    };

    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleConnect = () => {
        const newOption = prompt('Ingrese nuevo valor');
        if (newOption) {
            setOptions([...options, newOption]);
        }
    };

    return (
        <div id='layoutSidenav_content'>
            <main>
                <main className="container-w">
                    <input id="tab1" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab1" className="label-type">Tiempo Real</label>

                    

                    <section id="content1" className="tabs-contentype">
                        <select
                            value={selectedOption}
                            onChange={handleChange}
                        >
                            <option
                                value=""
                            >Seleccione una opción</option>
                            {
                                options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))
                            }
                        </select>
                        <button onClick={handleConnect}>Conectar</button>


                        <div className='App'>
                            <div className='charcpu'>
                                <h2>Memoria CPU</h2>
                                
                                <PieChartCPU dato={charDataCPU} />
                            </div>
                        </div>


                       <div className='tabs-section'>
                            <div className='tab-content'>
                                <div className='content-text'>
                                    <div className='editor'>
                                        <textarea
                                            className='text-area'
                                            value={contentPost}
                                            onChange={handleText}
                                        ></textarea>
                                        <button onClick={handlePost}>Print</button>
                                    </div>
                                </div>
                            </div>
                       </div>
                    </section>

                    
                </main>
            </main>
        </div>
    );        
}

export default RealTime;