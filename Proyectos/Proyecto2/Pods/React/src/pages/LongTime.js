// npm install socket.io-client

import React, { useEffect, useState, useCallback } from 'react';
import BarCharNotas from '../graphs/BarCharNotas';
import socketIOClient from 'socket.io-client';

function LongTime() {
    //Par barra de seleción
    const [isOpenAprobS, setIsOpenAprobS] = useState(false);

    const [selectedOptionAprobS, setSelectedOptionAprobS] = useState('');

    //db
    const [redisData, setRedisData] = useState([]);
    //conteo datos
    const [conteo, setConteo] = useState([
        { c1: null, no1: null }, // Asegúrate de que los elementos estén inicializados
        { c1: null, no1: null },
        { c1: null, no1: null },
        { c1: null, no1: null },
        { c1: null, no1: null },
    ]);

    const charNotas = {
        labels: ['5°', '4°', '3°', '2°', '1°'],
        datasets: [
            {
                label: (conteo[4]?.c1 !== null ? conteo[4].c1 : 'unknown'), 
                data: [(conteo[4]?.no1 !== null ? conteo[4].no1 : 0), 0, 0, 0, 0],
                backgroundColor: [ 'rgba(169, 50, 38, 0.7)', ],
                borderColor: [ 'rgba(169, 50, 38, 1)', ],
                borderWidth: 1,
            },
            {
                label: (conteo[3]?.c1 !== null ? conteo[3].c1 : 'unknown'),
                data: [0, (conteo[3]?.no1 !== null ? conteo[3].no1 : 0), 0, 0, 0],
                backgroundColor: [ 'rgba(125, 60, 152, 0.7)', ],
                borderColor: [ 'rgba(125, 60, 152, 1)', ],
                borderWidth: 1,
            },
            {
                label: (conteo[2]?.c1 !== null ? conteo[2].c1 : 'unknown'),
                data: [0, 0, (conteo[2]?.no1 !== null ? conteo[2].no1 : 0), 0, 0],
                backgroundColor: [ 'rgba(46, 134, 193, 0.7)', ],
                borderColor: [ 'rgba(46, 134, 193, 1)', ],
                borderWidth: 1,
            },
            {
                label: (conteo[1]?.c1 !== null ? conteo[1].c1 : 'unknown'),
                data: [0, 0, 0, (conteo[1]?.no1 !== null ? conteo[1].no1 : 0), 0],
                backgroundColor: [ 'rgba(23, 165, 137, 0.7)', ],
                borderColor: [ 'rgba(23, 165, 137, 1)', ],
                borderWidth: 1,
            },
            {
                label: (conteo[0]?.c1 !== null ? conteo[0].c1 : 'unknown'),
                data: [0, 0, 0, 0, (conteo[0]?.no1 !== null ? conteo[0].no1 : 0)],
                backgroundColor: [ 'rgba(241, 196, 15, 0.7)', ],
                borderColor: [ 'rgba(241, 196, 15, 1)', ],
                borderWidth: 1,
            },
        ],
    };
    
    const optionsSemester = [
        { id: '1S', label: '1S' },
        { id: '2S', label: '2S' },
    ];

    const toggleDropdownAprobS = () => {
        setIsOpenAprobS(!isOpenAprobS);
    };

    const handleOptionClickAprobS = (option) => {
        setSelectedOptionAprobS(option.label);
        setIsOpenAprobS(false);
    };

    const calculateCourses = useCallback(() => {
        let c1 = 'SO1', c2 = 'BD1', c3 = 'LFP', c4 = 'SA', c5 = 'AYD1';
        let no1 = 0, no2 = 0, no3 = 0, no4 = 0, no5 = 0
        const values = [];
        if (selectedOptionAprobS !== '') {
            redisData.forEach((student) => {
                if (student.Semestre === selectedOptionAprobS) {
                    if (student.Curso === 'SO1') { no1++; }
                    if (student.Curso === 'BD1') { no2++; }
                    if (student.Curso === 'LFP') { no3++; }
                    if (student.Curso === 'SA') { no4++; }
                    if (student.Curso === 'AYD1') { no5++; }
                }
            });
            values.push({ c1, no1 });
            c1 = c2; no1 = no2;
            values.push({ c1, no1 });
            c1 = c3; no1 = no3;
            values.push({ c1, no1 });
            c1 = c4; no1 = no4;
            values.push({ c1, no1 });
            c1 = c5; no1 = no5;
            values.push({ c1, no1 });
            values.sort((a, b) => b.no1 - a.no1);
        } else {
            values.push({ c1, no1 });
            c1 = c2; no1 = no2;
            values.push({ c1, no1 });
            c1 = c3; no1 = no3;
            values.push({ c1, no1 });
            c1 = c4; no1 = no4;
            values.push({ c1, no1 });
            c1 = c5; no1 = no5;
            values.push({ c1, no1 });
        }
        setConteo(values);
    }, [selectedOptionAprobS, redisData]);

    useEffect(() => {
        calculateCourses();
    }, [calculateCourses]);

    useEffect(() => {
        const socket = socketIOClient('http://34.172.224.220:3500', {
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });
        //socket.on('mysql-data', (data) => {//data es array
            //setMysqlData(data);
        //});
        
        socket.on('redis-dot', (data) => {
            //console.log('redis', data); //data[0].Carnet
            setRedisData(data);
        })
        
        socket.on('redis-local', (data) => {
            requestRedisData();
            //requestMySQLData();
        });

        //const requestMySQLData = () => {
            //socket.emit('request-mysql-data'); // Agregar un evento personalizado
            //calculateCounts();
        //};

        const requestRedisData = () => {
            socket.emit('request-redis-data');
        }

        requestRedisData();
        //requestMySQLData(); // Realizar la solicitud al cargar la página o cuando sea necesario
        
        // Definir un temporizador para solicitar MySQL data a intervalos regulares (por ejemplo, cada 30 segundos)
        const redisDataInterval = setInterval(requestRedisData, 1000);

        return () => {
            socket.off('redis-dot');
            socket.off('redis-local');
            //socket.off('mysql-data');
            // Limpiar el temporizador al desmontar el componente
            clearInterval(redisDataInterval);
        }
    }, []);

    return (
        <div id='layoutSidenav_content'>
            <main>
                <main className="container-w">
                    <input id="tab4" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab4" className="label-type">Redis</label>
                    <div className='conteo-datos'><b>Cantidad de Datos: </b> { redisData.length}</div>
                    <section id="content4" className="tabs-contentype">

                        <div className='container-pies-2'>
                            <div className='container-5'>
                                <div className='container-4'>
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
                                <div className='spooses'>
                                    <BarCharNotas dato={charNotas} />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </main>
        </div>
    );        
}

export default LongTime;