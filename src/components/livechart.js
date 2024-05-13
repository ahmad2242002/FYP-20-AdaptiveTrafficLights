import React, {useState, useEffect} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

export default function LiveChart({range, counts }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Live Vehicle Counts",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItem) => `Rating ${tooltipItem[0].label}`,
          label: (context) => {
            const count = context.dataset.data[context.dataIndex];
            return [
              "",
              `Count: ${count.toFixed(2)}`
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        Max: 100,
        suggestedMin: 0,
        ticks: {
          stepSize: 1,
          precision: 1,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Adjust the tension to make the line more or less curved
      },
    },
  };


  const [data, setData] = useState(generateInitialData());
  const [labels, setLabels] = useState(generateTimeLabels());
  useEffect(() => {
    const interval = setInterval(() => {

      // Update your data here
      // For demonstration, I'm just randomly generating data
      setLabels(generateTimeLabels());
      const newData = {
        labels: labels,
        datasets: [{
          label: 'Live Data',
          data: [...data.datasets[0].data.slice(1), counts], // Random data between 0 and 5
          borderColor: "#A6E3E9",
          backgroundColor: "white",
          borderWidth: 3
        }]
      };
      setData(newData);
    }, 3000); // Update every 3 seconds (adjust this value as needed)

    return () => clearInterval(interval); // Clean up on unmount
  }, [data, range]);

  return <Line options={options} data={data} />;
}
// Function to generate random initial data
function generateInitialData() {
  const labels = [];
  const data = [];

  for (let i = 0; i < 10; i++) {
    labels.push(`Label ${i}`);
    data.push(0); // Random data between 0 and 5
  }

  return {
    labels: generateTimeLabels(),
    datasets: [{
      label: 'Live Data',
      data: data,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };
}

function generateTimeLabels() {
    const currentTime = new Date();
    const labels = [];
  
    for (let i = 9; i >= 0; i--) {
      const time = new Date(currentTime.getTime() - i * 3000); // Subtracting 3 seconds for each label
      labels.push(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
    }
  
    return labels;
  }