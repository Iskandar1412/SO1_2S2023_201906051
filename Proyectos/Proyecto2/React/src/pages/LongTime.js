// npm install socket.io-client

import React, { useState, Component } from 'react';
//import React from 'react';
import axios from 'axios';
import BarCharNotas from '../graphs/BarCharNotas';
import socketIOClient from 'socket.io-client';


function LongTime() {
    const [longerRAM, setLongerRAM] = useState([]);
    const [libreRAM, setLibreRAM] = useState([]);
    const [longerCPU, setLongerCPU] = useState([]);
    const [libreCPU, setLibreCPU] = useState([]);
    const [labelText, setLabelText] = useState([]);


    const charNotas = {
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
    //Par barra de seleción
    const [isOpenAprobC, setIsOpenAprobC] = useState(false);
    const [isOpenAprobS, setIsOpenAprobS] = useState(false);

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

    const toggleDropdownAprobC = () => {
        setIsOpenAprobC(!isOpenAprobC);
    };

    const toggleDropdownAprobS = () => {
        setIsOpenAprobS(!isOpenAprobS);
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

    const handleGraphs = async () => {
        try {
            const response = await axios.get(`http://localhost:3200/registros-por-equipo?nombreEquipo=${selectedOptionAprobC}`);
            const valor = response.data;
            const valor1 = valor.registros;

            //console.log(valor1);
            const JsonFechas = [];
            const JsonRAM = [];
            const JsonCPU = [];
            const JsonLRAM = [];
            const JsonLCPU = [];
            valor1.forEach((x) => {
                const { Porcentaje_RAM, UsoCPU, fecha_registro } = x;
                JsonFechas.push(fecha_registro);
                JsonRAM.push(Porcentaje_RAM);
                const PorcentajeResRAM = 100-Porcentaje_RAM;
                JsonLRAM.push(PorcentajeResRAM);
                JsonCPU.push(UsoCPU);
                const PorcentajeResCPU = 100-UsoCPU;
                JsonLCPU.push(PorcentajeResCPU);
            });
            //console.log(JsonLRAM);
            setLabelText(JsonFechas)
            setLongerRAM(JsonRAM)
            setLongerCPU(JsonCPU)
            setLibreRAM(JsonLRAM)
            setLibreCPU(JsonLCPU)
            //console.log(JsonLCPU);
            //console.log(JsonCPU);
        } catch (e) {
            console.log('Error en la busqueda del equipo', e);
        }
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


                    <input id="tab4" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab4" className="label-type">Redis</label>
                    <div className='conteo-datos'><b>Cantidad de Datos:</b> 0</div>
                    <section id="content4" className="tabs-contentype">

                        <div className='container-pies-2'>
                            <div className='container-5'>
                                <div className='container-4'>
                                    <div className="Buscador">
                                        <div className={`droppdown ${isOpenAprobC ? 'active' : ''}`}>
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