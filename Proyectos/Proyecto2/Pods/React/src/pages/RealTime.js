import React, { useEffect, useState, useCallback } from 'react';
import PieChartCPU from '../graphs/PieChartCPU'
import BarCharAlumnos from '../graphs/BarCharAlumnos';
import BarCharCursos from '../graphs/BarCharCursos';
//import PieChartRAM from '../graphs/PieChartRAM';
import socketIOClient from 'socket.io-client';

function RealTime() {
    //Alumnos que reprueban y aprueban en base a semestre y curso
    const [alumnosApr, setAlumnosApr] = useState(0);
    const [alumnosRep, setAlumnosRep] = useState(0);
    //Alumnos con mejor promedio
    const [notasAlumnos, setNotasAlumnos] = useState([]);
    const [nombAlumnos, setNomAlumnos] = useState([]);
    //Cantidad de alumnos por curso
    const [cantAl, setCantAl] = useState([]);
    const [nomCur, setNomCur] = useState([]);
    //Par barra de seleción
    const [isOpenCursos, setIsOpenCursos] = useState(false);
    const [isOpenAlumnos, setIsOpenAlumnos] = useState(false);
    const [isOpenAprobC, setIsOpenAprobC] = useState(false);
    const [isOpenAprobS, setIsOpenAprobS] = useState(false);
    
    const [selectedOptionCursos, setSelectedOptionCursos] = useState('');
    const [selectedOptionAlumno, setSelectedOptionAlumno] = useState('');
    const [selectedOptionAprobC, setSelectedOptionAprobC] = useState('');
    const [selectedOptionAprobS, setSelectedOptionAprobS] = useState('');
    
    //items para procesos
    const [items, setItems] = useState(null);
    const [mysqlData, setMysqlData] = useState([]);
    
    const charDataCPU = {
        labels: ['Aprobados', 'Reprobados'],
        datasets: [
            {
                label: 'Grafica Alumnos [' + (selectedOptionAprobC !== '' ? selectedOptionAprobC : '') + ' - ' + (selectedOptionAprobS !== '' ? selectedOptionAprobS : '') + ']',
                data: [(alumnosApr !== 0 ? alumnosApr : 0), (alumnosRep !== 0 ? alumnosRep : 0)],
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

    const charCursos = {
        labels: ['3°', '2°', '1°'],
        datasets: [
            {
                label: nomCur[2],
                data: [cantAl[2], 0, 0],
                backgroundColor: [ 'rgba(230, 126, 34, 0.7)', ],
                borderColor: [ 'rgba(230, 126, 34, 1)', ],
                borderWidth: 1,
            },
            {
                label: nomCur[1],
                data: [0, cantAl[1], 0],
                backgroundColor: [ 'rgba(236, 240, 241, 0.7)', ],
                borderColor: [ 'rgba(236, 240, 241, 1)', ],
                borderWidth: 1,
            },
            {
                label: nomCur[0],
                data: [0, 0, cantAl[0]],
                backgroundColor: [ 'rgba(52, 73, 94, 0.7)', ],
                borderColor: [ 'rgba(52, 73, 94, 1)', ],
                borderWidth: 1,
            },
        ],
    };

    const charAlumnos = {
        labels: ['5°', '4°', '3°', '2°', '1°'],
        datasets: [
            {
                label: nombAlumnos[4], 
                data: [notasAlumnos[4], 0, 0, 0, 0],
                backgroundColor: [ 'rgba(169, 50, 38, 0.7)', ],
                borderColor: [ 'rgba(169, 50, 38, 1)', ],
                borderWidth: 1,
            },
            {
                label: nombAlumnos[3],
                data: [0, notasAlumnos[3], 0, 0, 0],
                backgroundColor: [ 'rgba(125, 60, 152, 0.7)', ],
                borderColor: [ 'rgba(125, 60, 152, 1)', ],
                borderWidth: 1,
            },
            {
                label: nombAlumnos[2],
                data: [0, 0, notasAlumnos[2], 0, 0],
                backgroundColor: [ 'rgba(46, 134, 193, 0.7)', ],
                borderColor: [ 'rgba(46, 134, 193, 1)', ],
                borderWidth: 1,
            },
            {
                label: nombAlumnos[1],
                data: [0, 0, 0, notasAlumnos[1], 0],
                backgroundColor: [ 'rgba(23, 165, 137, 0.7)', ],
                borderColor: [ 'rgba(23, 165, 137, 1)', ],
                borderWidth: 1,
            },
            {
                label: nombAlumnos[0],
                data: [0, 0, 0, 0, notasAlumnos[0]],
                backgroundColor: [ 'rgba(241, 196, 15, 0.7)', ],
                borderColor: [ 'rgba(241, 196, 15, 1)', ],
                borderWidth: 1,
            },
        ],
    };

    const optionsSemester = [
        { id: '1s', label: '1s' },
        { id: '2s', label: '2s' },
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
        setIsOpenCursos(false);
    };

    const handleOptionClickAlumnos = (option) => {
        setSelectedOptionAlumno(option.label);
        setIsOpenAlumnos(false);
    };

    const handleOptionClickAprobC = (option) => {
        setSelectedOptionAprobC(option.label);
        setIsOpenAprobC(false);
    };

    const handleOptionClickAprobS = (option) => {
        setSelectedOptionAprobS(option.label);
        setIsOpenAprobS(false);
    };
    
    const calculateCounts = useCallback(() => {
        let pass = 0;
        let fail = 0;
        if (selectedOptionAprobC !== '' && selectedOptionAprobS !== '') {
            mysqlData.forEach((student) => {
                if (student.Curso === selectedOptionAprobC && student.Semestre === selectedOptionAprobS) {
                    if (student.Nota >= 61) {
                        pass ++;
                    } else {
                        fail ++;
                    }
                }
            });
        }
        setAlumnosApr(pass);
        setAlumnosRep(fail);
    }, [selectedOptionAprobC, selectedOptionAprobS, mysqlData]);
    
    const calculateCursos = useCallback(() => {
        let c1 = 'SO1', c2 = 'BD1', c3 = 'LFP', c4 = 'SA', c5 = 'AYD1';
        let no1 = 0, no2 = 0, no3 = 0, no4 = 0, no5 = 0
        const values = [];
        const val2 = [];
        const val3 = []
        if (selectedOptionCursos !== '') {
            //console.log('asdf')
            mysqlData.forEach((student) => {
                if (student.Semestre === selectedOptionCursos) {
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
            for(var i = 0; i < 5; i++) {
                //console.log(values[i]);
                val2.push(values[i].no1);
                val3.push(values[i].c1);
            }
            setCantAl(val2);
            setNomCur(val3);
        } else {
            setCantAl([0, 0, 0, 0, 0]);
            setNomCur(['undefined', 'undefined', 'undefined', 'undefined', 'undefined']);
        }
        //setCantAlumnos(values);
    }, [selectedOptionCursos, mysqlData]);

    const calculateNotes = useCallback(() => {
        let c1 = 'unknown', c2 = 'unknown', c3 = 'unknown', c4 = 'unknown', c5 = 'unknown';
        let no1 = 0, no2 = 0, no3 = 0, no4 = 0, no5 = 0
        const values = [];
        const val2 = [];
        const val3 = [];
        if (selectedOptionAlumno !== '') {
            const filteredStudents = mysqlData
                .filter((student) => student.Semestre === selectedOptionAlumno)
                .sort((a, b) => b.Nota - a.Nota) // Ordena por nota de mayor a menor
                .slice(0, 5); // Toma los primeros 5 estudiantes
            
            if (filteredStudents.length > 0) {
                c1 = filteredStudents[0]?.Nombre ?? c1;
                no1 = filteredStudents[0]?.Nota ?? no1;
                c2 = filteredStudents[1]?.Nombre ?? c2;
                no2 = filteredStudents[1]?.Nota ?? no2;
                c3 = filteredStudents[2]?.Nombre ?? c3;
                no3 = filteredStudents[2]?.Nota ?? no3;
                c4 = filteredStudents[3]?.Nombre ?? c4;
                no4 = filteredStudents[3]?.Nota ?? no4;
                c5 = filteredStudents[4]?.Nombre ?? c5;
                no5 = filteredStudents[4]?.Nota ?? no5;
            }
            
            values.push({ c1, no1 })
            c1 = c2; no1 = no2;
            values.push({ c1, no1 });
            c1 = c3; no1 = no3;
            values.push({ c1, no1 });
            c1 = c4; no1 = no4;
            values.push({ c1, no1 });
            c1 = c5; no1 = no5;
            values.push({ c1, no1 });
            values.sort((a, b) => b.no1 - a.no1);
            for(var i = 0; i < 5; i++) {
                //console.log(values[i]);
                val2.push(values[i].no1);
                val3.push(values[i].c1);
            }
            setNotasAlumnos(val2);
            setNomAlumnos(val3);
        } else {
            setNotasAlumnos([0, 0, 0, 0, 0]);
            setNomAlumnos(['undefined', 'undefined', 'undefined', 'undefined', 'undefined']);
        }
    }, [selectedOptionAlumno, mysqlData]);

    useEffect(() => {
        calculateCounts();
    }, [calculateCounts]);

    useEffect(() => {
        calculateNotes();
    }, [calculateNotes]);

    useEffect(() => {
        calculateCursos();
    }, [calculateCursos]);

    useEffect(() => {
        const socket = socketIOClient('http://34.134.29.202:3500', {
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
        });
        socket.on('mysql-data', (data) => {//data es array
            setMysqlData(data);
        });
        
        socket.on('redis-dot', (data) => {
            //console.log('redis', data); //data[0].Carnet
        })
        
        socket.on('redis-local', (data) => {
            //requestRedisData();
            requestMySQLData();
        });

        const requestMySQLData = () => {
            socket.emit('request-mysql-data'); // Agregar un evento personalizado
            //calculateCounts();
        };

        //const requestRedisData = () => {
        //    socket.emit('request-redis-data');
        //}

        //requestRedisData();
        requestMySQLData(); // Realizar la solicitud al cargar la página o cuando sea necesario
        
        // Definir un temporizador para solicitar MySQL data a intervalos regulares (por ejemplo, cada 30 segundos)
        const mysqlDataInterval = setInterval(requestMySQLData, 1000);

        return () => {
            socket.off('redis-local');
            socket.off('mysql-data');
            // Limpiar el temporizador al desmontar el componente
            clearInterval(mysqlDataInterval);
        }
    }, []);

    
    
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
                                        {mysqlData.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`list-item ${items === item.Carnet ? 'expanded' : ''}`}
                                                onClick={() => toggleItemExpansion(item.Carnet)}
                                            >
                                                <span>{ item.Carnet }</span>
                                                <span>{ item.Nombre }</span>
                                                <span>{ item.Curso }</span>
                                                <span>{ item.Nota }</span>
                                                <span>{ item.Semestre }</span>
                                                <span>{ item.Year }</span>
                                            </div>
                                        ))}
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