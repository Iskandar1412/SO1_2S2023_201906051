// npm install socket.io-client
import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Other extends Component {
    constructor() {
        super();
        this.state = {
            datosRedis: null
        };
        this.socket = socketIOClient('ip:port');
    }

    componentDidMount() {
        this.socket.on('datos_redis', (data) => {
            this.setState({ datosRedis: data });
        });
    }

    sendMessage = () => {
        this.socket.emit('mensaje', this.state.message);
    };

    render() {
        return (
            <div id='layoutSidenav_content'>
                <main>
                    <main className='container-w'>
                        <section id='content1' className='tabs-contentype'>
                            <div className='tab-section-2'>
                                <div className='tab-content'>
                                    <div className='content-text'>
                                        <div className='lista-procesos'>
                                            <div className='list-item header'>
                                                <span>Album</span>
                                                <span>artist</span>
                                                <span>year</span>
                                            </div>
                                            {this.state.datosRedis ? (
                                                <div className='list-item'>
                                                    <span>{ this.state.datosRedis.album }</span>
                                                    <span>{ this.state.datosRedis.artist }</span>
                                                    <span>{ this.state.datosRedis.year }</span>
                                                </div>
                                            ): (
                                                <p>Esperando de la db...</p>
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
}

export default Other;