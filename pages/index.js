import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const defaultChecklist = {
    eggs: false,
    bread: false,
    seeds: false,
    yogurt: false,
    fishOil: false,
    vitaminC: false,
    multi: false,
  };

  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState('');
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [log, setLog] = useState([]);

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleToggle = (item) => {
    setChecklist({ ...checklist, [item]: !checklist[item] });
  };

  const handleSubmit = async () => {
    if (!weight || !calories) return;
    const entry = {
      Date: date,
      Weight: parseFloat(weight),
      Calories: parseInt(calories),
      Eggs: checklist.eggs,
      Bread: checklist.bread,
      Seeds: checklist.seeds,
      Yogurt: checklist.yogurt,
      FishOil: checklist.fishOil,
      VitaminC: checklist.vitaminC,
      Multi: checklist.multi,
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbx9L-LbTmoK0iqbHvGPHgeF455CuH4PRqmgQY_q4-aLPhzJDVzTp7wjQvEjhMCMY_8C/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });

      setLog([...log, entry]);
      setChecklist(defaultChecklist);
      setWeight('');
      setCalories('');
    } catch (err) {
      console.error("Failed to submit entry", err);
    }
  };

  const graphDataWeight = {
    labels: log.map(entry => entry.Date),
    datasets: [{
      label: 'Weight (lbs)',
      data: log.map(entry => entry.Weight),
      borderColor: 'blue',
      backgroundColor: 'lightblue',
    }]
  };

  const graphDataCalories = {
    labels: log.map(entry => entry.Date),
    datasets: [{
      label: 'Calories',
      data: log.map(entry => entry.Calories),
      borderColor: 'orange',
      backgroundColor: 'lightyellow',
    }]
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>90-Day Weight & Calorie Tracker</h1>
      <p>Date: {date}</p>
      <input
        type="number"
        placeholder="Enter weight (lbs)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '10px', color: 'black' }}
      />
      <input
        type="number"
        placeholder="Enter total calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '10px', color: 'black' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {Object.keys(checklist).map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={checklist[item]}
              onChange={() => handleToggle(item)}
            /> {item}
          </label>
        ))}
      </div>
      <button onClick={handleSubmit} style={{ marginTop: '10px', padding: '10px', width: '100%' }}>
        Save Entry
      </button>
      <div style={{ marginTop: '30px' }}>
        <h2>Weight Progress</h2>
        <Line data={graphDataWeight} />
      </div>
      <div style={{ marginTop: '30px' }}>
        <h2>Calorie Intake</h2>
        <Line data={graphDataCalories} />
      </div>
    </div>
  );
}