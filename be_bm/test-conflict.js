async function testConflict() {
    const url = `http://localhost:3000/api/machines`;
    const headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOltdLCJpYXQiOjE3Njc0NDA2OTAsImV4cCI6MTc2NzQ0OTY5MH0.0jP0jSGDj2oyazoyGCxT3YGdgOTsZJ-vWszdwHKiAHE'
    };
    const body = JSON.stringify({
        code: 'VTMM0005', // Existing code
        name: 'Máy duplicate test',
        categoryId: 'f2e2b60e-b44b-477f-badd-db8f9f683fbd',
        statusId: 'd7ead483-d18c-444f-87cb-7022dd428f7f',
        unitId: '65aa9b7d-a4b0-4d48-ab5c-777f1e57f3ba',
        branchId: '71174d12-302b-4c7e-8fea-1b999a82a820',
        departmentId: '4c049989-95d1-4ead-afce-a07a4d1ec690'
    });

    try {
        const response = await fetch(url, { method: 'POST', headers, body });
        const data = await response.json();
        console.log('STATUS:', response.status);
        console.log('RESPONSE:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('ERROR:', error.message);
    }
}

testConflict();
