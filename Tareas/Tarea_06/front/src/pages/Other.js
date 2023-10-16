// npm install socket.io-client
import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Other extends Component {
    constructor() {
        super();
        this.state = {
            redisData: [],
        };
        this.socket = socketIOClient('http://localhost:9800'); // Cambia la URL si es diferente
    }

    componentDidMount() {
        this.socket.on('redis-data', (data) => {
            this.setState((prevState) => {
                const newData = [...prevState.redisData, data];
                const uniqueData = [...new Set(newData)]; // Utiliza un Set para eliminar duplicados
                return {
                    redisData: uniqueData,
                };
            });
        });
    }
        //console.log(this.redisData);
    

    render() {
        return (
            <div id='layoutSidenav_content'>
                <main>
                    <main className="container-w">
                        <input id="tab1" type="radio" name="tabs" defaultChecked />
                        <label htmlFor="tab1" className="label-type">Real Time</label>
                        <section id="content1" className="tabs-contentype">
                                                 
                            <div className='tab-section-2'>
                                <div className='tab-content'>
                                    <div className='content-text'>
                                        <div className='lista-procesos'>
                                            <div className='list-item-2 header'>
                                                
                                                <span>Album</span>
                                                <span>Artista</span>
                                                <span>Year</span>
                                            </div>
                                            {
                                                this.state.redisData.map((data, index) => (
                                                    <div className='list-item-2' key={index}>
                                                        <span> { data.album } </span>
                                                        <span> { data.artista } </span>
                                                        <span> { data.year } </span>
                                                    </div>
                                                ))
                                            }
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
}

export default Other;
