import React, { useState } from 'react';
//import React from 'react';
import axios from 'axios';
import MultiaxisChartCPU from '../graphs/MultiaxisChartCPU';
import MultiaxisChartRAM from '../graphs/MultiaxisChartRAM';



function LongTime() {
    const longRAM  = {
        labels: ['en', 'feb', 'mar', 'abr', 'may', 'jun'],
        datasets: [
            {
                label: 'G1',
                data: [100, 20, 30, 50, 700, 20],
                borderColor: 'rgb(82, 12, 139)',
                backgroundColor: 'rgba(82, 12, 139, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'G2',
                data: [5, 70, 10, 500, 40, 90],
                borderColor: 'rgb(160, 115, 29)',
                backgroundColor: 'rgba(160, 115, 29, 0.2)',
                yAxisID: 'y',
            },
        ],
    };
    
    const longCPU  = {
        labels: ['en', 'feb', 'mar', 'abr', 'may', 'jun'],
        datasets: [
            {
                label: 'G1',
                data: [100, 20, 30, 50, 700, 20],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y',
            },
            {
                label: 'G2',
                data: [5, 70, 10, 500, 40, 90],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                yAxisID: 'y',
            },
        ],
    };


    return (
        <div id='layoutSidenav_content'>
            <main>
                <main className="container-w">


                    <input id="tab4" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab4" className="label-type">Long Time</label>

                    <section id="content4" className="tabs-contentype">
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