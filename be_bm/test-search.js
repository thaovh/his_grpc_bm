async function test() {
    const url = 'http://localhost:3000/api/machines?page=1&limit=25&q=VTMM0005';
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOltdLCJpYXQiOjE3Njc0NDA2OTAsImV4cCI6MTc2NzQ0OTY5MH0.0jP0jSGDj2oyazoyGCxT3YGdgOTsZJ-vWszdwHKiAHE'
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        if (response.ok) {
            console.log('SUCCESS:', JSON.stringify(data, null, 2));
        } else {
            console.error('ERROR RESPONSE:', response.status, JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('ERROR:', error.message);
    }
}

test();
