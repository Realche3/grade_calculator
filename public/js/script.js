document.addEventListener('DOMContentLoaded', () => {
  const componentsContainer = document.getElementById('components');
  const addComponentButton = document.getElementById('addComponent');
  const calculateGradeButton = document.getElementById('calculateGrade');
  const resultDiv = document.getElementById('result');

  // Add a new component input
  addComponentButton.addEventListener('click', () => {
    const componentDiv = document.createElement('div');
    componentDiv.className = 'component';

    componentDiv.innerHTML = `
      <input type="text" placeholder="Component Name" class="component-name">
      <input type="number" placeholder="Grade (%)" class="component-grade">
      <input type="number" placeholder="Weight (%)" class="component-weight">
    `;

    componentsContainer.appendChild(componentDiv);
  });

  // Calculate the final grade
  calculateGradeButton.addEventListener('click', async () => {
    const components = document.querySelectorAll('.component');
    const data = [];
    let totalWeight = 0;

    components.forEach(component => {
      const name = component.querySelector('.component-name').value;
      const grade = parseFloat(component.querySelector('.component-grade').value);
      const weight = parseFloat(component.querySelector('.component-weight').value);

      if (name && !isNaN(grade) && !isNaN(weight)) {
        data.push({ name, grade, weight });
        totalWeight += weight;
      }
    });

    if (data.length === 0) {
      resultDiv.innerHTML = '<div class="error">Please add at least one component.</div>';
      return;
    }

    if (totalWeight !== 100) {
      resultDiv.innerHTML = '<div class="error">Total weight must be exactly 100%.</div>';
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/calculate-grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ components: data }),
      });

      const result = await response.json();
      const finalGrade = result.finalGrade.toFixed(2);
      const letterGrade = getLetterGrade(finalGrade);

      // Display result
      resultDiv.innerHTML = `
        <div class="result-display ${finalGrade >= 50 ? 'pass' : 'fail'}">
          Final Grade: ${finalGrade}% (${letterGrade})
        </div>
      `;

      // Fireworks for B+ to A+
      if (['B+', 'A-', 'A', 'A+'].includes(letterGrade)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      resultDiv.innerHTML = '<div class="error">An error occurred while calculating the grade.</div>';
    }
  });

  // Function to get letter grade based on percentage
  function getLetterGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 77) return 'B+';
    if (percentage >= 73) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 67) return 'C+';
    if (percentage >= 63) return 'C';
    if (percentage >= 60) return 'C-';
    if (percentage >= 57) return 'D+';
    if (percentage >= 53) return 'D';
    if (percentage >= 50) return 'D-';
    return 'F';
  }
});