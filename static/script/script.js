document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const formData = new FormData(this);
  
    try {
      const response = await fetch('http://localhost:3000/api/authenticate', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
  
      document.getElementById('result').innerText = result.message;
    } catch (error) {
      console.error('Error:', error);
    }
  });
  