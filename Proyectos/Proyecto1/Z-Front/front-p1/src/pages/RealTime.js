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
        console.log(contentPost);
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
        handleProcesos()
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

    //items para procesos
    const [items, setItems] = useState(null);
    const [procesos, setProcesos] = useState([]);
    const itmp = [
        { id: 1, proceso:'asdf', pid: 12465, uid: 1212, estado: "U", memoriav: 1250, memoriaf: 12546 },
        { id: 2, proceso:'asdff', pid: 1364, uid: 12512, estado: "S", memoriav: 1450, memoriaf: 122 },
        { id: 3, proceso:'python', pid: 4879, uid: 412, estado: "T", memoriav: 250, memoriaf: 1254 },
        { id: 4, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
        { id: 5, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
        { id: 6, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
        { id: 7, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
        { id: 8, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
        { id: 9, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
        { id: 10, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
        { id: 11, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    ];
    const handleProcesos = () => {
        setProcesos(itmp)
        console.log(itmp)
    };

    const toggleItemExpansion = (itemID) => {
        setItems(prevId => (prevId === itemID ? null : itemID));
    };

    return (
        <div id='layoutSidenav_content'>
            <main>
                <main className="container-w">
                    <input id="tab1" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab1" className="label-type">Real Time</label>
                    <section id="content1" className="tabs-contentype">
                        
                        <div className="Buscador">
                            <span className="choose">Seleccionar Maquina</span>
                            <div className={`droppdown ${isOpen ? 'active' : ''}`}>
                                <div className="sellect" onClick={toggleDropdown}>
                                    <span className='name-tipo'><b>{selectedOption || 'Nombre Maquina'}</b></span>
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
                        
                        <div className='tab-section-2'>
                            <div className='tab-content'>
                                <div className='content-text'>
                                    <div className='lista-procesos'>
                                        <div className='list-item header'>
                                            <span>No.</span>
                                            <span>Proceso</span>
                                            <span>PID</span>
                                            <span>UID</span>
                                            <span>Estado</span>
                                            <span>M.Virtual</span>
                                            <span>M.Física</span>
                                        </div>
                                        {procesos.map(proceso =>
                                            <div
                                                key={proceso.id}
                                                className={`list-item ${items === proceso.id ? 'expanded' : ''}`}
                                                onClick={() => toggleItemExpansion(proceso.id)}
                                            >
                                                <span>{ proceso.id }</span>
                                                <span>{ proceso.proceso }</span>
                                                <span>{ proceso.pid }</span>
                                                <span>{ proceso.uid }</span>
                                                <span>{ proceso.estado }</span>
                                                <span>{ proceso.memoriav }</span>
                                                <span>{ proceso.memoriaf }</span>
                                            </div>
                                        )}
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