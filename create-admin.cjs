const https = require('https');

const data = JSON.stringify({
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrador'
});

const options = {
    hostname: 'foodtrack-ghost-backend-production.up.railway.app',
    port: 443,
    path: '/users',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Creando usuario admin...');

const req = https.request(options, res => {
    console.log(`Estado: ${res.statusCode}`);

    res.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error('Error:', error);
});

req.write(data);
req.end();
