import React, { useState } from 'react';
//import React from 'react';
import axios from 'axios';



function LongTime() {

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
    } 


    return (
        <div id='layoutSidenav_content'>
            <main>
                <main className="container-w">
                    <input id="tab1" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab1" className="label-type">Analyzer</label>

                    <input id="tab2" type="radio" name="tabs" />
                    <label htmlFor="tab2" className="label-type">Errores</label>

                    <input id="tab3" type="radio" name="tabs" />
                    <label htmlFor="tab3" className="label-type">Árbol AST</label>

                    <input id="tab4" type="radio" name="tabs" />
                    <label htmlFor="tab4" className="label-type">Tabla de Símbolos</label>

                    <section id="content1" className="tabs-contentype">
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

                    <section id="content2" className="tabs-contentype">
                        <div id="seccion-errores" >

                        </div>
                        
                    </section>

                    <section id="content3" className="tabs-contentype">
                        <div id="seccion-ast"></div>
                    </section>

                    <section id="content4" className="tabs-contentype">
                        <div id="seccion-tabla" ></div>
                    
                    </section>
                </main>
            </main>
        </div>
    );        
}

export default LongTime;