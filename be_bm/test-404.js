async function test404() {
    const id = '99999999-9999-9999-9999-999999999999';
    const url = `http://localhost:3000/api/machines/${id}`;
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOltdLCJpYXQiOjE3Njc0NDA2OTAsImV4cCI6MTc2NzQ0OTY5MH0.0jP0jSGDj2oyazoyGCxT3YGdgOTsZJ-vWszdwHKiAHE'
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        console.log('STATUS:', response.status);
        console.log('RESPONSE:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('ERROR:', error.message);
    }
}

test404();
