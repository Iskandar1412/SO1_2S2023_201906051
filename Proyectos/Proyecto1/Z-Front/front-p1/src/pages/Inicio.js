import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

//npm install axios

function Inicio() {
    

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

                        <div className="tabs-section">
                            <div className="tabs-container">
                            {tabs.map((tab) => (
                                <div
                                key={tab.id}
                                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => handleTabClick(tab.id)}
                                >
                                P{tab.id}
                                <button
                                    className="delete-tab"
                                    onClick={() => handleDeleteTab(tab.id)}
                                >
                                    𝒙
                                </button>
                                </div>
                            ))}
                            <button className="add-tab" onClick={handleAddTab}>
                                +
                            </button>
                            </div>
                            <div className="tab-content">
                            {activeTab !== null && (
                                <>
                                <div className="content-text">
                                    <div className="editor">
                                    <textarea
                                        className="text-area"
                                        value={tabs.find((tab) => tab.id === activeTab)?.value1}
                                        onChange={(e) => {
                                        const newTabs = [...tabs];
                                        const tabIndex = newTabs.findIndex(
                                            (tab) => tab.id === activeTab
                                        );
                                        newTabs[tabIndex] = {
                                            ...newTabs[tabIndex],
                                            value1: e.target.value,
                                        };
                                        setTabs(newTabs);
                                        }}
                                    ></textarea>
                                    </div>
                                    <div className="editor">
                                    <textarea
                                        className="text-area"
                                        value={tabs.find((tab) => tab.id === activeTab)?.value2}
                                        readOnly
                                    ></textarea>
                                    </div>
                                </div>
                                <div className="content-button">
                                    <button
                                    className="open-file"
                                    
                                    >
                                        Open File
                                    </button>
                                    <button
                                    className="acept-analyze"
                                    >
                                        Analyze
                                    </button>
                                    <button className="save-file" >
                                        Save File
                                    </button>
                                </div>
                                </>
                            )}
                            </div>
                        </div>
                        
                    </section>

                    <section id="content2" className="tabs-contentype">
                        <div id="seccion-errores">

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

export default Inicio;