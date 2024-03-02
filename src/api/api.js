export async function createUser(username, score) {
    const data = { username, score };
  
   const response =  await fetch('http://localhost:8080/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    console.log(response);
}

export async function updateScore(username, score) {
  
    const response = await fetch(`http://localhost:8080/user/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: parseInt(score) }),
      });

}

export async function fetchUser(username) {
  
    const response = await fetch(`http://localhost:8080/user/${username}`);
    const data = await response.json();


    return data;
}

export async function fetchAllUser() {
    const response = await fetch('http://localhost:8080/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;

}