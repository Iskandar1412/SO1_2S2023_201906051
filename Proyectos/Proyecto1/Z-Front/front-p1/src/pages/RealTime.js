import React, { useState } from 'react';
import axios from 'axios';
import PieChartCPU from '../graphs/PieChartCPU'
import PieChartRAM from '../graphs/PieChartRAM';

function RealTime() {
    //const [dataram, setdataram] = useRef([]);
    //const [datacpu, setdatacpu] = useRef([]);

    const charDataCPU = {
        labels: ['Usada', 'Libre'],
        datasets: [
            {
                label: 'Grafica CPU',
                data: [150, 30],
                backgroundColor: [
                    'rgba(185, 35, 23, 0.5)',
                    'rgba(23, 185, 153, 0.5)',
                ],
                borderColor: [
                    'rgba(185, 35, 23, 1)',
                    'rgba(23, 185, 153, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    const charDataRAM = {
        labels: ['Usada', 'Libre'],
        datasets: [
            {
                label: 'Grafica RAM',
                data: [70, 30],
                backgroundColor: [
                    'rgba(160, 115, 29, 0.7)',
                    'rgba(29, 160, 96, 0.7)',
                ],
                borderColor: [
                    'rgba(160, 115, 29, 1)',
                    'rgba(29, 160, 96, 1)',
                ],
                borderWidth: 1,
            }
        ]
    }

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

    //Par barra de seleción
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const options = [
        { id: 'maquina1', label: 'maquina 1' },
        { id: 'maquina2', label: 'maquina2' },
        { id: 'maquina3', label: 'maquina3'}
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option.label);
        //console.log(option)
        handleSuccess()
        setIsOpen(false);
    };

    //mensaje
    const [isSuccess, setIsSuccess] = useState(false);
    const handleSuccess = () => {
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
        }, 3000)
    }

    return (
        <div id='layoutSidenav_content'>
            <main>
                <main className="container-w">
                    <input id="tab1" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab1" className="label-type">Tiempo Real</label>
                    <section id="content1" className="tabs-contentype">
                        
                        <div className="Buscador">
                            <span className="choose">Seleccionar Maquina</span>
                            <div className={`droppdown ${isOpen ? 'active' : ''}`}>
                                <div className="sellect" onClick={toggleDropdown}>
                                    <span>{selectedOption || 'Nombre Maquina'}</span>
                                    <i className={`fa fa-chevron-left ${isOpen ? 'open' : ''}`}></i>
                                </div>
                                <ul className={`droppdown-menu ${isOpen ? 'show' : ''}`}>
                                {options.map((option) => (
                                    <li
                                    key={option.id}
                                    onClick={() => handleOptionClick(option)}
                                    className={selectedOption === option.label ? 'selected' : ''}
                                    >
                                    {option.label}
                                    </li>
                                ))}
                                </ul>
                            </div>
                            {isSuccess && <span className="msg">Changed Macchine: <strong>{selectedOption}</strong></span>}
                        </div>

                        <div className='container-pies'>
                            <PieChartCPU dato={charDataCPU} />
                            <PieChartRAM dato={charDataRAM} />
                        </div>


                       <div className='tab-section-2'>
                            <div className='tab-content'>
                                <div className='content-text'>
                                    <div className='editor-pid'>
                                        <h3 className='pid-tit'>PID</h3>
                                        <input
                                            type='text'
                                            className='text-pid'
                                            value={contentPost}
                                            onChange={handleText}
                                        />
                                        <button className='kill-pid' onClick={handlePost}>Kill</button>
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