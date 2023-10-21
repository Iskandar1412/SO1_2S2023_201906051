import React, { useCallback, useEffect, useState, Component } from 'react';
import axios from 'axios';
import PieChartCPU from '../graphs/PieChartCPU'
import BarCharAlumnos from '../graphs/BarCharAlumnos';
import BarCharCursos from '../graphs/BarCharCursos';
//import PieChartRAM from '../graphs/PieChartRAM';
import socketIOClient from 'socket.io-client';

function RealTime() {
    //const [dataram, setdataram] = useRef([]);
    //const [datacpu, setdatacpu] = useRef([]);
    //const [ramUsada, setRamUsada] = useState(0);
    //const [cpuUsado, setCPUUsado] = useState(0);
    
    const charDataCPU = {
        labels: ['Aprobados', 'Reprobados'],
        datasets: [
            {
                label: 'Grafica Alumnos',
                data: [10, 20],
                backgroundColor: [
                    'rgba(23, 165, 137, 0.5)',
                    'rgba(185, 35, 23, 0.5)',
                ],
                borderColor: [
                    'rgba(23, 165, 137, 1)',
                    'rgba(185, 35, 23, 1)',
                ],
                borderWidth: 1,
            }
        ]
    }; 

    const charAlumnos = {
        labels: ['3°', '2°', '1°'],
        datasets: [
            {
                label: "Quimica",
                data: [25, 0, 0],
                backgroundColor: [ 'rgba(230, 126, 34, 0.7)', ],
                borderColor: [ 'rgba(230, 126, 34, 1)', ],
                borderWidth: 1,
            },
            {
                label: "Fisica",
                data: [0, 50, 0],
                backgroundColor: [ 'rgba(236, 240, 241, 0.7)', ],
                borderColor: [ 'rgba(236, 240, 241, 1)', ],
                borderWidth: 1,
            },
            {
                label: "Matemáticas",
                data: [0, 0, 75],
                backgroundColor: [ 'rgba(52, 73, 94, 0.7)', ],
                borderColor: [ 'rgba(52, 73, 94, 1)', ],
                borderWidth: 1,
            },
        ],
    };

    const charCursos = {
        labels: ['5°', '4°', '3°', '2°', '1°'],
        datasets: [
            {
                label: "Quimica",
                data: [25, 0, 0, 0, 0],
                backgroundColor: [ 'rgba(169, 50, 38, 0.7)', ],
                borderColor: [ 'rgba(169, 50, 38, 1)', ],
                borderWidth: 1,
            },
            {
                label: "Fisica",
                data: [0, 50, 0, 0, 0],
                backgroundColor: [ 'rgba(125, 60, 152, 0.7)', ],
                borderColor: [ 'rgba(125, 60, 152, 1)', ],
                borderWidth: 1,
            },
            {
                label: "Matemáticas",
                data: [0, 0, 75, 0, 0],
                backgroundColor: [ 'rgba(46, 134, 193, 0.7)', ],
                borderColor: [ 'rgba(46, 134, 193, 1)', ],
                borderWidth: 1,
            },
            {
                label: "Sociales",
                data: [0, 0, 0, 45, 0],
                backgroundColor: [ 'rgba(23, 165, 137, 0.7)', ],
                borderColor: [ 'rgba(23, 165, 137, 1)', ],
                borderWidth: 1,
            },
            {
                label: "Naturales",
                data: [0, 0, 0, 0, 90],
                backgroundColor: [ 'rgba(241, 196, 15, 0.7)', ],
                borderColor: [ 'rgba(241, 196, 15, 1)', ],
                borderWidth: 1,
            },
        ],
    };

    //console.log("CHart data:" , charDataCPU);
    
    const [contentPost, setcontentPost] = useState([]);
    const handleText = (e) => {
        setcontentPost(e.target.value);
    };

    const handlePost = async () => {
        //console.log(contentPost);
        //e.preventDefault();
        const data = {
            pid: contentPost
        }
        //const valor = contentPost; //valor del input
        try {
            const response = await fetch(`http://localhost:3200/kill-proccess?equipo=${selectedOptionCursos}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(data),
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result);
            } else {
                console.log('Error en la solicitud', response.statusText);
            }
        } catch (err) { console.log('Error en la solicitud al backend (NodeJS):', err) }
    };

    //Par barra de seleción
    const [isOpenCursos, setIsOpenCursos] = useState(false);
    const [isOpenAlumnos, setIsOpenAlumnos] = useState(false);
    const [isOpenAprobC, setIsOpenAprobC] = useState(false);
    const [isOpenAprobS, setIsOpenAprobS] = useState(false);
    
    const [selectedOptionCursos, setSelectedOptionCursos] = useState('');
    const [selectedOptionAlumno, setSelectedOptionAlumno] = useState('');
    const [selectedOptionAprobC, setSelectedOptionAprobC] = useState('');
    const [selectedOptionAprobS, setSelectedOptionAprobS] = useState('');
    
    const optionsSemester = [
        { id: '1S', label: '1S' },
        { id: '2S', label: '2S' },
    ];

    const optionsCursos = [
        { id: 'SO1', label: 'SO1' },
        { id: 'BD1', label: 'BD1' },
        { id: 'LFP', label: 'LFP' },
        { id: 'SA', label: 'SA' },
        { id: 'AYD1', label: 'AYD1' },
    ];
   
    const toggleDropdownAlumnos = () => {
        setIsOpenAlumnos(!isOpenAlumnos);
    };

    const toggleDropdownCursos = () => {
        setIsOpenCursos(!isOpenCursos);
    };

    const toggleDropdownAprobC = () => {
        setIsOpenAprobC(!isOpenAprobC);
    };

    const toggleDropdownAprobS = () => {
        setIsOpenAprobS(!isOpenAprobS);
    };


    const handleOptionClickCursos = (option) => {
        setSelectedOptionCursos(option.label);
        //console.log(option)
        //handleSuccess()
        setIsOpenCursos(false);
        //handleProcesos()
    };

    const handleOptionClickAlumnos = (option) => {
        setSelectedOptionAlumno(option.label);
        //console.log(option)
        //handleSuccess()
        setIsOpenAlumnos(false);
        //handleProcesos()
    };

    const handleOptionClickAprobC = (option) => {
        setSelectedOptionAprobC(option.label);
        //console.log(option)
        //handleSuccess()
        setIsOpenAprobC(false);
        //handleProcesos()
    };

    const handleOptionClickAprobS = (option) => {
        setSelectedOptionAprobS(option.label);
        //console.log(option)
        //handleSuccess()
        setIsOpenAprobS(false);
        //handleProcesos()
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
    
    const fetchData = useCallback(async () => {
        if (!selectedOptionCursos) {
            //console.log('vacio')
            return;
        }
        try {
            const response = await axios.get(`http://localhost:3200/live?eQuipo=${selectedOptionCursos}`);
            const data = response.data;
            const proceso_val = data.CPU.Procesos;
            //setCPUUsado(data.CPU.Uso_de_CPU);
            //setRamUsada(data.RAM.Uso_ram[0].Porcentaje_en_uso);
            console.log(data.RAM);
            setProcesos(proceso_val)
            //console.log(data.CPU.Uso_de_CPU, data.RAM.Porcentaje_en_uso)
        } catch (e) {
            console.log('Error en la obtención de datos en tiempo real', e);
        }
    }, [selectedOptionCursos]);

    const [redisData, setRedisData] = useState([]);
    const [mysqlData, setMysqlData] = useState([]);
    useEffect(() => {
        const socket = socketIOClient('http://localhost:9800');
        socket.on('mysql-data', (data) => {
            console.log('datos',data);
        });
        socket.on('redis-data', (data) => {
            requestMySQLData();
            setRedisData((prevData) => {
                const newData = [...prevData, data];
                const uniqueData = [...new Set(newData)];
                return uniqueData;
            });
        });
        const requestMySQLData = () => {
            socket.emit('request-mysql-data'); // Agregar un evento personalizado
        };

        requestMySQLData(); // Realizar la solicitud al cargar la página o cuando sea necesario

        return () => {
            socket.off('redis-data');
            socket.off('mysql-data');
            //socket.disconnect();
        }
    }, []);

    const handleProcesos = async () => {
        fetchData();
    };

    const toggleItemExpansion = (itemID) => {
        setItems(prevId => (prevId === itemID ? null : itemID));
    };



    return (
        <div id='layoutSidenav_content'>
            <main>
                <main className="container-w">
                    <input id="tab1" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab1" className="label-type">MySQL</label>
                    <section id="content1" className="tabs-contentype">
                        
                        <div className='tab-section-2'>
                            <div className='tab-content'>
                                <div className='content-text'>
                                    <div className='lista-procesos'>
                                        <div className='list-item header'>
                                            
                                            <span>Carnet</span>
                                            <span>Nombre</span>
                                            <span>Curso</span>
                                            <span>Nota</span>
                                            <span>Semestre</span>
                                            <span>Year</span>
                                        </div>
                                        {procesos.map(proceso =>
                                            <div
                                                key={proceso.Proceso}
                                                className={`list-item ${items === proceso.Proceso ? 'expanded' : ''}`}
                                                onClick={() => toggleItemExpansion(proceso.Proceso)}
                                            >
                                                <span>{ proceso.Proceso }</span>
                                                <span>{ proceso.PID }</span>
                                                <span>{ proceso.UID }</span>
                                                <span>{ proceso.Estado }</span>
                                                <span>{ proceso.Memoria_virtual }</span>
                                                <span>{ proceso.Memoria_fisica }</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='container-pies'>
                            <div className='container-1'>
                                <div className='container-4'>
                                    <div className="Buscador">
                                        <div className={`droppdown ${setIsOpenAprobC ? 'active' : ''}`}>
                                            <div className="sellect" onClick={toggleDropdownAprobC}>
                                                <span className='name-tipo'><b>{selectedOptionAprobC || 'Cursos'}</b></span>
                                                <i className={`fa fa-chevron-left ${isOpenAprobC ? 'open' : ''}`}></i>
                                            </div>
                                            <ul className={`droppdown-menu ${isOpenAprobC ? 'show' : ''}`}>
                                                {optionsCursos.map((option) => (
                                                    <li
                                                    key={option.id}
                                                    onClick={() => handleOptionClickAprobC(option)}
                                                    className={selectedOptionAprobC === option.label ? 'selected' : ''}
                                                    >
                                                    {option.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="Buscador">
                                        <div className={`droppdown ${isOpenAprobS ? 'active' : ''}`}>
                                            <div className="sellect" onClick={toggleDropdownAprobS}>
                                                <span className='name-tipo'><b>{selectedOptionAprobS || 'Semestre'}</b></span>
                                                <i className={`fa fa-chevron-left ${isOpenAprobS ? 'open' : ''}`}></i>
                                            </div>
                                            <ul className={`droppdown-menu ${isOpenAprobS ? 'show' : ''}`}>
                                                {optionsSemester.map((option) => (
                                                    <li
                                                    key={option.id}
                                                    onClick={() => handleOptionClickAprobS(option)}
                                                    className={selectedOptionAprobS === option.label ? 'selected' : ''}
                                                    >
                                                    {option.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <PieChartCPU dato={charDataCPU} />
                            </div>
                            <div className='container-2'>
                                <div className='container-3'>
                                <div className="Buscador">
                                    <div className={`droppdown ${isOpenAlumnos ? 'active' : ''}`}>
                                        <div className="sellect" onClick={toggleDropdownAlumnos}>
                                            <span className='name-tipo'><b>{selectedOptionAlumno || 'Semestre'}</b></span>
                                            <i className={`fa fa-chevron-left ${isOpenAlumnos ? 'open' : ''}`}></i>
                                        </div>
                                        <ul className={`droppdown-menu ${isOpenAlumnos ? 'show' : ''}`}>
                                            {optionsSemester.map((option) => (
                                                <li
                                                key={option.id}
                                                onClick={() => handleOptionClickAlumnos(option)}
                                                className={selectedOptionAlumno === option.label ? 'selected' : ''}
                                                >
                                                {option.label}
                                                </li>
                                            ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <BarCharAlumnos dato={charAlumnos} />
                                </div>
                                <div className='container-3'>
                                    <div className="Buscador">
                                        <div className={`droppdown ${isOpenCursos ? 'active' : ''}`}>
                                            <div className="sellect" onClick={toggleDropdownCursos}>
                                                <span className='name-tipo'><b>{selectedOptionCursos || 'Semestre'}</b></span>
                                                <i className={`fa fa-chevron-left ${isOpenCursos ? 'open' : ''}`}></i>
                                            </div>
                                            <ul className={`droppdown-menu ${isOpenCursos ? 'show' : ''}`}>
                                            {optionsSemester.map((option) => (
                                                <li
                                                key={option.id}
                                                onClick={() => handleOptionClickCursos(option)}
                                                className={selectedOptionCursos === option.label ? 'selected' : ''}
                                                >
                                                {option.label}
                                                </li>
                                            ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <BarCharCursos dato={charCursos} />
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