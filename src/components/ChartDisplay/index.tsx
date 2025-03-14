import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface ChartDisplayProps {
    chartData: ChartData<'bar'>;
    chartOptions: ChartOptions<'bar'>;
}


const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartData, chartOptions }) => {
    return (
        <div className="mb-6">
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default ChartDisplay;