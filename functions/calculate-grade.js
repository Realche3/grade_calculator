exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      };
    }
  
    const { components } = JSON.parse(event.body);
  
    if (!components || components.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No components provided.' }),
      };
    }
  
    let totalWeight = 0;
    let weightedSum = 0;
  
    components.forEach((component) => {
      const { grade, weight } = component;
      weightedSum += grade * (weight / 100);
      totalWeight += weight;
    });
  
    if (totalWeight !== 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Total weight must be 100%.' }),
      };
    }
  
    const finalGrade = weightedSum;
    return {
      statusCode: 200,
      body: JSON.stringify({ finalGrade }),
    };
  };