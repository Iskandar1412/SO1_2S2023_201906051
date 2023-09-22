import React, { useState } from 'react';
//import React from 'react';
import axios from 'axios';
import MultiaxisChartCPU from '../graphs/MultiaxisChartCPU';
import MultiaxisChartRAM from '../graphs/MultiaxisChartRAM';



function LongTime() {
    const [longerRAM, setLongerRAM] = useState([]);
    const [libreRAM, setLibreRAM] = useState([]);
    const [longerCPU, setLongerCPU] = useState([]);
    const [libreCPU, setLibreCPU] = useState([]);
    const [labelText, setLabelText] = useState([]);


    const longRAM  = {
        labels: labelText,
        datasets: [
            {
                label: 'Uso',
                data: longerRAM,
                borderColor: 'rgb(82, 12, 139)',
                backgroundColor: 'rgba(82, 12, 139, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'Libre',
                data: libreRAM,
                borderColor: 'rgb(160, 115, 29)',
                backgroundColor: 'rgba(160, 115, 29, 0.2)',
                yAxisID: 'y',
            },
        ],
    };
    
    const longCPU  = {
        labels: labelText,
        datasets: [
            {
                label: 'Uso',
                data: longerCPU,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'Libre',
                data: libreCPU,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                yAxisID: 'y',
            },
        ],
    };
    //Par barra de seleción
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    //mv1: proyecto1-c2n1  ::  34.42.36.164
    //mv2: proyecto1-t16q  ::  34.135.153.28
    const options = [
        { id: 'proyecto1-c2n1', label: 'proyecto1-c2n1', ip: '34.42.36.164' },
        { id: 'proyecto1-t16q', label: 'proyecto1-t16q', ip: '34.135.153.28' },
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        //handleProcesos()
        setSelectedOption(option.label);
        //console.log(option)
        handleSuccess()
        setIsOpen(false);
        const tiepoEspera = 1000;
        setTimeout(() => {
            handleGraphs();
        }, tiepoEspera);
    };

    const handleGraphs = async () => {
        try {
            const response = await axios.get(`http://localhost:3200/registros-por-equipo?nombreEquipo=${selectedOption}`);
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
                    <label htmlFor="tab4" className="label-type">Long Time</label>

                    <section id="content4" className="tabs-contentype">

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
                            <MultiaxisChartCPU dato={longCPU} />
                        </div>
                        <div className='container-pies'>
                            <MultiaxisChartRAM dato={longRAM} />
                        </div>
                        
                    </section>

                </main>
            </main>
        </div>
    );        
}

export default LongTime;